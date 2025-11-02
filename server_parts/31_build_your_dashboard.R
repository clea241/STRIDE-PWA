# Build your Dashboard

# --- Drilldown State Management ---
global_drill_state <- reactiveVal(list(
  level = "Region", 
  region = NULL,    
  division = NULL,
  coc_filter = NULL,      
  typology_filter = NULL, 
  shifting_filter = NULL  # <-- NEW: To store the Shifting filter
))
global_trigger <- reactiveVal(0) 

# --- Observer Lifecycle Manager ---
drilldown_observers <- reactiveVal(list())

# --- NEW: Selection Order Tracker ---
# This reactiveVal tracks the *click order* of metrics,
# because input$selected_metrics (from a standard selectInput) does not.
selection_order <- reactiveVal(character(0))

observeEvent(input$selected_metrics, {
  current_selection <- input$selected_metrics
  # Use isolate() to compare the new value to the old value
  old_selection <- isolate(selection_order())
  
  # 1. Find items that were *added*
  # (items in the new list that weren't in the old one)
  newly_added <- setdiff(current_selection, old_selection)
  
  # 2. Find items that were *kept*
  # We filter the *old* list to preserve its order
  kept_items <- old_selection[old_selection %in% current_selection]
  
  # 3. The new order is the kept items, plus the new items at the end
  new_order <- c(kept_items, newly_added)
  
  # 4. Save the new, correctly-ordered list
  selection_order(new_order)
  
}, ignoreNULL = FALSE) # ignoreNULL=FALSE ensures it runs even when cleared


# --- *** UPDATED: OBSERVER TO SYNC PICKER -> TOGGLES *** ---
# This observes the pickerInput. If the user manually removes
# metrics, this will uncheck the corresponding toggle.
observeEvent(input$selected_metrics, {
  
  current_selection <- input$selected_metrics
  # Handle empty selection
  if (is.null(current_selection)) {
    current_selection <- character(0)
  }
  
  # --- *** FIXED: Use the SAME metric lists as the toggle observers *** ---
  teacher_metrics <- c("TotalTeachers", "Total.Shortage","Total.Excess")
  classroom_metrics <- c("Instructional.Rooms.2023.2024","Classroom.Requirement","Buildings","Shifting") 
  school_metrics <- c("Total.Schools","School.Size.Typology","Modified.COC") 
  
  
  # Check if ALL metrics for a group are selected
  all_teacher_selected <- all(teacher_metrics %in% current_selection)
  all_school_selected <- all(school_metrics %in% current_selection)
  all_classroom_selected <- all(classroom_metrics %in% current_selection)
  
  # --- *** START OF FIX *** ---
  # Only send an update if the toggle's current value is
  # DIFFERENT from the value we want to set. This breaks the loop.
  
  if (isolate(input$preset_teacher) != all_teacher_selected) {
    
    # We still use freezeReactiveValue for safety
    freezeReactiveValue(input, "preset_teacher") 
    shinyWidgets::updateAwesomeCheckbox(
      session,
      "preset_teacher",
      value = all_teacher_selected
    )
  }
  
  if (isolate(input$preset_school) != all_school_selected) {
    
    freezeReactiveValue(input, "preset_school")
    shinyWidgets::updateAwesomeCheckbox(
      session,
      "preset_school",
      value = all_school_selected
    )
  }
  
  if (isolate(input$preset_classroom) != all_classroom_selected) {
    
    freezeReactiveValue(input, "preset_classroom")
    shinyWidgets::updateAwesomeCheckbox(
      session,
      "preset_classroom",
      value = all_classroom_selected
    )
  }
  # --- *** END OF FIX *** ---
  
}, ignoreNULL = FALSE, ignoreInit = TRUE) # <-- Added ignoreInit = TRUE

# --- NEW: Map & Table Server Logic (Optimized) ---

# --- 1. Base Leaflet Map ---
# Renders the map using all data from the current drilldown/filter state.
# --- 1. Base Leaflet Map ---
# Renders the map using all data from the current drilldown/filter state.
output$school_map <- leaflet::renderLeaflet({
  
  # --- *** Wait for first user drilldown/filter *** ---
  req(global_trigger() > 0)
  
  data_to_map_raw <- filtered_data() # Get the raw filtered data
  
  # Stop if no data or no coordinate columns
  req(nrow(data_to_map_raw) > 0)
  req("Latitude" %in% names(data_to_map_raw), "Longitude" %in% names(data_to_map_raw))
  
  # --- *** NEW FIX: Force columns to numeric *before* using scales::comma *** ---
  # This prevents the "round_any" error on character objects
  data_to_map <- data_to_map_raw %>%
    mutate(
      # Use as.numeric(as.character(...)) to handle potential factors/text
      TotalEnrolment = as.numeric(as.character(TotalEnrolment)),
      Instructional.Rooms.2023.2024 = as.numeric(as.character(Instructional.Rooms.2023.2024)),
      TotalTeachers = as.numeric(as.character(TotalTeachers))
    )
  # --- *** END OF FIX *** ---
  
  leaflet(data_to_map) %>%
    
    # --- Using satellite imagery tile ---
    addProviderTiles(providers$Esri.WorldImagery) %>%
    
    # Fit map to show all data points
    fitBounds(
      lng1 = min(data_to_map$Longitude, na.rm = TRUE),
      lat1 = min(data_to_map$Latitude, na.rm = TRUE),
      lng2 = max(data_to_map$Longitude, na.rm = TRUE),
      lat2 = max(data_to_map$Latitude, na.rm = TRUE)
    ) %>%
    addMarkers(
      lng = ~Longitude,
      lat = ~Latitude,
      
      # --- UPDATED: Handle NAs and format numbers in hover label ---
      # This code is now safe because the columns were converted to numeric
      label = ~lapply(paste(
        "<strong>School:</strong>", htmltools::htmlEscape(School.Name),
        "<br/><strong>School ID:</strong>", htmltools::htmlEscape(SchoolID),
        "<br/><strong>Latitude:</strong>", htmltools::htmlEscape(Latitude),
        "<br/><strong>Longitude:</strong>", htmltools::htmlEscape(Longitude),
        "<br/><strong>Typology:</strong>", htmltools::htmlEscape(School.Size.Typology),
        
        "<br/><strong>Total Enrolment:</strong>", 
        ifelse(is.na(TotalEnrolment), "N/A", scales::comma(TotalEnrolment, accuracy = 1)),
        "<br/><strong>Total Classrooms:</strong>", 
        ifelse(is.na(Instructional.Rooms.2023.2024), "N/A", scales::comma(Instructional.Rooms.2023.2024, accuracy = 1)),
        "<br/><strong>Total Teachers:</strong>", 
        ifelse(is.na(TotalTeachers), "N/A", scales::comma(TotalTeachers, accuracy = 1))
      ), htmltools::HTML),
      
      # --- Added labelOptions for styling the hover label ---
      labelOptions = labelOptions(
        noHide = FALSE, 
        direction = 'auto', 
        style = list(
          "font-weight" = "normal", 
          "padding" = "3px 8px",
          "background-color" = "rgba(255, 255, 255, 0.85)", # Semi-transparent white
          "border" = "1px solid rgba(0,0,0,0.3)" # Faint border
        )
      ),
      
      # Use the unique ID as the layerId for proxy clicks
      layerId = ~SchoolID,
      clusterOptions = markerClusterOptions() # Cluster points when zoomed out
    )
})

# --- 2. Reactive Data for Table (filters by map bounds) ---
# This reactive filters 'filtered_data()' based on
# what is currently visible in the 'school_map' bounds.
data_in_bounds <- reactive({
  
  data_to_filter <- filtered_data()
  req(nrow(data_to_filter) > 0)
  req("Latitude" %in% names(data_to_filter), "Longitude" %in% names(data_to_filter))
  
  # Get map bounds from the input
  bounds <- input$school_map_bounds
  
  # If bounds are NULL (map not initialized), return all data
  if (is.null(bounds)) {
    return(data_to_filter)
  }
  
  # Filter data to include only points within the map bounds
  data_to_filter %>%
    filter(
      Latitude >= bounds$south & Latitude <= bounds$north &
        Longitude >= bounds$west & Longitude <= bounds$east
    )
})

# --- 3. Render the Datatable ---
# This table *only* shows the data from the 'data_in_bounds()' reactive.
# It will automatically update when the map is panned or zoomed.
output$school_table <- DT::renderDataTable({
  
  # --- *** NEW: Wait for first user drilldown/filter *** ---
  req(global_trigger() > 0)
  
  data_for_table <- data_in_bounds()
  
  # ASSUMPTION: Selecting columns to show. Change these as needed.
  cols_to_show <- c("SchoolID", "School.Name", "Division", "Region", "TotalTeachers", "Modified.COC")
  
  # Keep only columns that actually exist in the data
  cols_to_show <- intersect(cols_to_show, names(data_for_table))
  
  req(length(cols_to_show) > 0)
  
  DT::datatable(
    data_for_table[, cols_to_show],
    selection = 'single', # Allow only single row selection
    rownames = FALSE,
    options = list(
      pageLength = 10,
      scrollY = "400px", # Adjusted height
      scrollCollapse = TRUE,
      paging = FALSE # Disable paging, use scroll instead
    )
  )
})

# --- 4. Observer (Table -> Map) ---
# This zooms the map when a user clicks a row in the datatable.
observeEvent(input$school_table_rows_selected, {
  
  # Get the selected row number
  selected_row_index <- input$school_table_rows_selected
  req(selected_row_index)
  
  # Get the data *currently in the table*
  table_data <- data_in_bounds()
  
  # Get the specific row that was clicked
  selected_row_data <- table_data[selected_row_index, ]
  
  # Ensure we have lat/lng
  req("Latitude" %in% names(selected_row_data), "Longitude" %in% names(selected_row_data))
  
  # Use leafletProxy to zoom the map without re-rendering it
  leafletProxy("school_map", session) %>%
    setView(
      lng = selected_row_data$Longitude,
      lat = selected_row_data$Latitude,
      zoom = 15 # You can adjust this zoom level
    )
})


# --- *** UPDATED: PRESET TOGGLE OBSERVERS *** ---
# These observers now ADD or REMOVE metrics based on the toggle state.

# Preset 1: Teacher Focus Toggle
observeEvent(input$preset_teacher, {
  # 1. Get the metrics that are *already* selected
  current_selection <- isolate(input$selected_metrics)
  
  # 2. Define the metrics for *this* preset
  teacher_metrics <- c("TotalTeachers", "Total.Shortage","Total.Excess")
  
  # 3. Add or Remove based on the checkbox value
  if (input$preset_teacher == TRUE) {
    # Add metrics: union() merges and removes duplicates
    new_selection <- union(current_selection, teacher_metrics)
  } else {
    # Remove metrics: setdiff() keeps items in 'current_selection'
    # that are NOT in 'teacher_metrics'
    new_selection <- setdiff(current_selection, teacher_metrics)
  }
  
  # 4. Update the picker input
  shinyWidgets::updatePickerInput(
    session, 
    "selected_metrics", 
    selected = new_selection
  )
}, ignoreInit = TRUE)

# Preset 2: Categorical/Demographic Focus Toggle
observeEvent(input$preset_classroom, {
  
  # 1. Get the metrics that are *already* selected
  current_selection <- isolate(input$selected_metrics)
  
  # 2. Define the metrics for *this* preset
  classroom_metrics <- c("Instructional.Rooms.2023.2024","Classroom.Requirement","Buildings","Shifting") 
  
  # 3. Add or Remove based on the checkbox value
  if (input$preset_classroom == TRUE) {
    # Add metrics
    new_selection <- union(current_selection, classroom_metrics)
  } else {
    # Remove metrics
    new_selection <- setdiff(current_selection, classroom_metrics)
  }
  
  # 4. Update the picker input
  shinyWidgets::updatePickerInput(
    session, 
    "selected_metrics", 
    selected = new_selection
  )
}, ignoreInit = TRUE)

observeEvent(input$preset_school, {
  
  # 1. Get the metrics that are *already* selected
  current_selection <- isolate(input$selected_metrics)
  
  # 2. Define the metrics for *this* preset
  school_metrics <- c("Total.Schools","School.Size.Typology","Modified.COC") 
  
  # 3. Add or Remove based on the checkbox value
  if (input$preset_school == TRUE) {
    # Add metrics
    new_selection <- union(current_selection, school_metrics)
  } else {
    # Remove metrics
    new_selection <- setdiff(current_selection, school_metrics)
  }
  
  # 4. Update the picker input
  shinyWidgets::updatePickerInput(
    session, 
    "selected_metrics", 
    selected = new_selection
  )
}, ignoreInit = TRUE)


# --- Back Button Logic (Updated for Dynamic Label) ---
output$back_button_ui <- renderUI({
  state <- global_drill_state() 
  button_label <- ""  # Initialize
  show_button <- FALSE # Flag to control visibility
  
  # --- Determine button label based on the state, in reverse priority order ---
  
  # --- NEW: Check for Shifting Filter (Highest priority undo) ---
  if (!is.null(state$shifting_filter)) {
    
    label_text <- stringr::str_trunc(state$shifting_filter, 20) 
    button_label <- paste("Undo Filter:", label_text)
    show_button <- TRUE
    
    # 1. Check for Typology Filter
  } else if (!is.null(state$typology_filter)) {
    
    # Use str_trunc to prevent a very long button label
    label_text <- stringr::str_trunc(state$typology_filter, 20) 
    button_label <- paste("Undo Filter:", label_text)
    show_button <- TRUE
    
    # 2. Check for COC Filter
  } else if (!is.null(state$coc_filter)) {
    
    label_text <- stringr::str_trunc(state$coc_filter, 20)
    button_label <- paste("Undo Filter:", label_text)
    show_button <- TRUE
    # 3. Check for Legislative District Level
  } else if (state$level == "Legislative.District") {
    
    button_label <- "Undo Drilldown" # Or "Go Back to Division"
    show_button <- TRUE
    
    # 4. Check for Division Level
  } else if (state$level == "Division") {
    
    button_label <- "Undo Drilldown" # Or "Go Back to Region"
    show_button <- TRUE
  }
  
  # --- Render the button only if one of the conditions was met ---
  if (show_button) { 
    
    # --- UPDATED: Added class = "btn-danger" to make the button red ---
    actionButton("back_button", 
                 button_label, 
                 icon = icon("undo"), 
                 class = "btn-danger") # <-- THIS IS THE CHANGE
  }
})

observeEvent(input$back_button, {
  state <- isolate(global_drill_state()) 
  new_state <- state # Start with the current state
  
  # --- CHANGED: Clear categorical filters first (in reverse order) ---
  
  # --- NEW: Shifting filter cleared first ---
  if (!is.null(state$shifting_filter)) {
    new_state$shifting_filter <- NULL
  } else if (!is.null(state$typology_filter)) {
    new_state$typology_filter <- NULL # Clear typology filter
  } else if (!is.null(state$coc_filter)) {
    new_state$coc_filter <- NULL      # Clear COC filter
  } 
  # --- Original logic for geographic drill-up ---
  else if (state$level == "Legislative.District") {
    new_state$level <- "Division"
    new_state$division <- NULL
  } else if (state$level == "Division") {
    new_state$level <- "Region"
    new_state$region <- NULL
  }
  
  global_drill_state(new_state)
  global_trigger(global_trigger() + 1) 
})


# --- DYNAMIC OBSERVER MANAGER ---
# --- DYNAMIC OBSERVER MANAGER ---
observe({
  # --- CHANGED: Use our new ordered list ---
  selected_metrics <- selection_order() 
  
  # (Rest of this observer is unchanged)
  old_handles <- isolate(drilldown_observers())
  walk(old_handles, ~ .x$destroy()) 
  
  new_handles <- map(selected_metrics, ~{
    current_metric <- .x
    current_metric_source <- paste0("plot_source_", current_metric)
    
    # --- NEW: Categorical Filter Observers ---
    
    # This observer handles clicks on the Modified.COC chart
    observeEvent(event_data("plotly_click", source = "coc_pie_click"), {
      d <- event_data("plotly_click", source = "coc_pie_click")
      
      if (is.null(d$y)) return() # Horizontal bar charts use 'y'
      clicked_coc <- d$y        
      
      state <- isolate(global_drill_state())
      # Only update if the filter is new
      if (is.null(state$coc_filter) || state$coc_filter != clicked_coc) {
        state$coc_filter <- clicked_coc
        global_drill_state(state)
        global_trigger(global_trigger() + 1)
      }
      
    }, ignoreNULL = TRUE, ignoreInit = TRUE)
    
    # This observer handles clicks on the School.Size.Typology bar chart
    observeEvent(event_data("plotly_click", source = "typology_bar_click"), {
      d <- event_data("plotly_click", source = "typology_bar_click")
      if (is.null(d$y)) return() # Horizontal bar charts use 'y'
      
      clicked_typology <- d$y
      
      state <- isolate(global_drill_state())
      # Only update if the filter is new
      if (is.null(state$typology_filter) || state$typology_filter != clicked_typology) {
        state$typology_filter <- clicked_typology
        global_drill_state(state)
        global_trigger(global_trigger() + 1)
      }
      
    }, ignoreNULL = TRUE, ignoreInit = TRUE)
    
    # --- *** NEW: Observer for Shifting *** ---
    # This observer handles clicks on the Shifting bar chart
    observeEvent(event_data("plotly_click", source = "shifting_bar_click"), {
      d <- event_data("plotly_click", source = "shifting_bar_click")
      if (is.null(d$y)) return() # Horizontal bar charts use 'y'
      
      clicked_shifting <- d$y
      
      state <- isolate(global_drill_state())
      # Only update if the filter is new
      if (is.null(state$shifting_filter) || state$shifting_filter != clicked_shifting) {
        state$shifting_filter <- clicked_shifting
        global_drill_state(state)
        global_trigger(global_trigger() + 1)
      }
      
    }, ignoreNULL = TRUE, ignoreInit = TRUE)
    # --- *** END OF NEW OBSERVER *** ---
    
    # --- Geographic Drilldown Observer ---
    observeEvent(event_data("plotly_click", source = current_metric_source), {
      state <- isolate(global_drill_state()) 
      if (state$level == "Legislative.District") return()
      d <- event_data("plotly_click", source = current_metric_source)
      if (is.null(d$y)) return()
      clicked_category <- d$y 
      
      # --- *** NEW VALIDATION STEP *** ---
      # This check prevents "stale" clicks from re-firing
      # when the UI is redrawn by a preset button.
      
      # 1. Get the data that is *supposed* to be in the current plot
      current_plot_data <- tryCatch({
        summarized_data_long() %>%
          filter(Metric == current_metric)
      }, error = function(e) { tibble() })
      
      # 2. Check if the click is valid
      # If the clicked category (e.g., "Region I") is NOT in the
      # current plot's data (e.g., c("SDO I", "SDO II")), then
      # this is a stale click. Ignore it.
      if (nrow(current_plot_data) == 0 || !clicked_category %in% current_plot_data$Category) {
        return()
      }
      # --- *** END OF VALIDATION STEP *** ---
      
      # If the click is valid, proceed with drilldown
      new_state <- list()
      if (state$level == "Region") {
        new_state <- list(level = "Division", region = clicked_category, division = NULL)
      } else if (state$level == "Division") {
        new_state <- list(level = "Legislative.District", region = state$region, division = clicked_category)
      }
      global_drill_state(new_state)
      global_trigger(global_trigger() + 1)
    }, ignoreNULL = TRUE, ignoreInit = TRUE)
  })
  
  drilldown_observers(new_handles)
})


# --- Reactive Data (Updated) ---
filtered_data <- reactive({
  trigger <- global_trigger() 
  state <- global_drill_state()
  temp_data <- uni
  
  # --- 1. Geographic filters (Unchanged) ---
  if (state$level == "Division") {
    req(state$region)
    temp_data <- temp_data %>% filter(Region == state$region)
  } else if (state$level == "Legislative.District") {
    req(state$region, state$division)
    temp_data <- temp_data %>% 
      filter(Region == state$region, Division == state$division)
  }
  
  # --- 2. NEW: Categorical filters ---
  # Apply COC filter if it exists
  if (!is.null(state$coc_filter)) {
    temp_data <- temp_data %>% filter(Modified.COC == state$coc_filter)
  }
  
  # Apply Typology filter if it exists
  if (!is.null(state$typology_filter)) {
    temp_data <- temp_data %>% filter(School.Size.Typology == state$typology_filter)
  }
  
  # --- NEW: Apply Shifting filter if it exists ---
  if (!is.null(state$shifting_filter)) {
    temp_data <- temp_data %>% filter(Shifting == state$shifting_filter)
  }
  
  temp_data
})

# --- Reactive Data (Updated for "Total Schools" count and Robust NA/Numeric Conversion) ---
summarized_data_long <- reactive({
  # This reactive doesn't care about UI order, so it can
  # still use input$selected_metrics directly.
  req(input$selected_metrics) 
  state <- global_drill_state() 
  group_by_col <- state$level  
  
  metrics_to_process <- input$selected_metrics 
  data_in <- filtered_data()
  
  # A list to hold our different summary tibbles
  summaries_list <- list()
  
  # --- NEW: Special handling for "Total Schools" ---
  if ("Total.Schools" %in% metrics_to_process) {
    
    school_count_summary <- data_in %>%
      group_by(!!sym(group_by_col)) %>%
      summarise(Value = n(), .groups = "drop") %>% # <-- Count rows (n())
      rename(Category = !!sym(group_by_col)) %>%
      mutate(Metric = "Total.Schools") # <-- Assign the metric name
    
    # Add it to our list
    summaries_list[["school_count"]] <- school_count_summary
  }
  # --- END of new "Total Schools" logic ---
  
  
  # --- EXISTING: Handle all other standard numeric metrics ---
  
  # Define categorical metrics to exclude them from this numeric summary
  categorical_metrics <- c("Modified.COC", "School.Size.Typology", "Total.Schools","Shifting")
  
  # Get only the standard numeric metrics selected by the user
  numeric_metrics_to_process <- setdiff(metrics_to_process, categorical_metrics)
  
  existing_metrics <- intersect(numeric_metrics_to_process, names(data_in))
  
  if (length(existing_metrics) > 0) {
    
    # --- *** NEW: Force all potential metrics to numeric IN THE DATA *** ---
    # This converts columns to numeric *before* the 'is.numeric' check.
    # It handles factors/characters (e.g., "1,000", "N/A")
    # by coercing them, creating NAs where needed.
    data_in <- data_in %>%
      mutate(
        across(
          all_of(existing_metrics), 
          ~ as.numeric(as.character(.)) # as.character() handles factors
        )
      )
    # --- *** END OF NEW CODE *** ---
    
    # Now, this check will correctly identify the columns we just converted
    valid_metrics <- existing_metrics[sapply(data_in[existing_metrics], is.numeric)]
    
    if (length(valid_metrics) > 0) {
      
      # Perform the standard pivot/sum for all *other* numeric metrics
      numeric_summary <- data_in %>%
        select(!!sym(group_by_col), all_of(valid_metrics)) %>%
        pivot_longer(
          cols = all_of(valid_metrics),
          names_to = "Metric",
          values_to = "Value"
        ) %>%
        group_by(!!sym(group_by_col), Metric) %>%
        # This sum() now safely handles NAs from coercion AND original NAs
        summarise(Value = sum(Value, na.rm = TRUE), .groups = "drop") %>%
        rename(Category = !!sym(group_by_col))
      
      # Add this tibble to our list
      summaries_list[["numeric_metrics"]] <- numeric_summary
    }
  }
  
  # --- Combine all summaries into one long tibble ---
  if (length(summaries_list) == 0) {
    # Return an empty tibble if no valid metrics were found
    return(tibble(Category = character(), Metric = character(), Value = numeric()))
  }
  
  # Bind all the tibbles in the list (e.g., school counts + teacher counts)
  final_summary_data <- bind_rows(summaries_list)
  
  return(final_summary_data)
})


# --- Dynamic UI: Combined Dashboard Grid (Updated) ---
# --- Dynamic UI: Combined Dashboard Grid (Updated) ---
# --- Dynamic UI: Combined Dashboard Grid (Updated) ---
# --- Dynamic UI: Combined Dashboard Grid (Updated) ---
output$dashboard_grid <- renderUI({
  
  selected_metrics <- selection_order() 
  
  if (length(selected_metrics) == 0) {
    return(tags$h4("Please select at least one metric to display graphs."))
  }
  
  # --- 1. Create Plotly Renders ---
  walk(selected_metrics, ~{
    current_metric <- .x
    current_metric_name <- names(metric_choices)[metric_choices == current_metric]
    
    # --- NEW: Unified Title Logic ---
    # Get the state ONCE for all plots
    state <- global_drill_state()
    level_name <- stringr::str_to_title(state$level) 
    plot_title <- current_metric_name # Start with the metric name
    
    # A. Add geographic context
    if (state$level == "Region") {
      plot_title <- paste(plot_title, "by", level_name)
    } else if (state$level == "Division") {
      plot_title <- paste(plot_title, "by", level_name, "in", state$region)
    } else if (state$level == "Legislative.District") {
      plot_title <- paste(plot_title, "by", level_name, "in", state$division)
    }
    
    # B. Add filter context
    filter_parts <- c()
    if (!is.null(state$coc_filter)) {
      filter_parts <- c(filter_parts, state$coc_filter)
    }
    if (!is.null(state$typology_filter)) {
      filter_parts <- c(filter_parts, state$typology_filter)
    }
    if (!is.null(state$shifting_filter)) {
      filter_parts <- c(filter_parts, state$shifting_filter)
    }
    
    # Append filters to the title if any exist
    if (length(filter_parts) > 0) {
      plot_title <- paste0(plot_title, " (Filtered by: ", paste(filter_parts, collapse = ", "), ")")
    }
    # --- END of Unified Title Logic ---
    
    
    # --- Conditional Plot Rendering ---
    
    # --- *** FIX 1: Added "Total.Schools" to this condition *** ---
    if (current_metric == "Modified.COC" || current_metric == "School.Size.Typology" || current_metric == "Shifting" || current_metric == "Total.Schools") {
      # --- RENDER CATEGORICAL BAR CHART ---
      output[[paste0("plot_", current_metric)]] <- renderPlotly({
        tryCatch({
          
          # --- Special data handling for categorical ---
          # "Total.Schools" comes from summarized_data_long
          # The others come from filtered_data()
          
          bar_data <- tibble() # Initialize
          
          if (current_metric == "Total.Schools") {
            
            bar_data <- summarized_data_long() %>%
              filter(Metric == "Total.Schools") %>%
              filter(!is.na(Category)) %>%
              rename(Count = Value) # Rename Value to Count
            
          } else {
            
            plot_data_bar <- filtered_data()
            if (nrow(plot_data_bar) > 0) {
              bar_data <- plot_data_bar %>%
                count(!!sym(current_metric), name = "Count") %>%
                filter(!is.na(!!sym(current_metric))) %>%
                rename(Category = !!sym(current_metric)) 
            }
          }
          
          if (nrow(bar_data) == 0) {
            return(
              plot_ly() %>% 
                layout(
                  title = list(text = plot_title, x = 0.05), # Use unified title
                  annotations = list(x = 0.5, y = 0.5, text = "No data available for this view", showarrow = FALSE, font = list(size = 14))
                )
            )
          }
          
          plot_source <- dplyr::case_when(
            current_metric == "Modified.COC" ~ "coc_pie_click",
            current_metric == "School.Size.Typology" ~ "typology_bar_click",
            current_metric == "Shifting" ~ "shifting_bar_click", 
            # "Total.Schools" uses the default drilldown, so we give it a standard source
            TRUE ~ paste0("plot_source_", current_metric) 
          )
          
          # Use plot_source for drilldown if it's NOT a filter
          click_source_name <- if (plot_source %in% c("coc_pie_click", "typology_bar_click", "shifting_bar_click")) {
            plot_source
          } else {
            paste0("plot_source_", current_metric) # Standard drilldown
          }
          
          p_bar <- plot_ly(
            data = bar_data,
            y = ~Category, 
            x = ~Count,
            type = "bar",
            orientation = 'h',
            name = current_metric_name,
            texttemplate = '%{x:,.0f}', textposition = "outside",
            cliponaxis = FALSE, textfont = list(color = '#000000', size = 10),
            source = click_source_name 
          ) %>%
            layout(
              title = list(text = plot_title, x = 0.05), # Use unified title
              yaxis = list(title = "", categoryorder = "total descending", autorange = "reversed"),
              xaxis = list(title = "Total Count", tickformat = ',.0f'),
              legend = list(orientation = 'h', xanchor = 'center', x = 0.5, yanchor = 'bottom', y = 1.02),
              margin = list(l = 150) 
            )
          
          p_bar
          
        }, error = function(e) {
          # ... (Error handling unchanged) ...
        })
      })
      
    } else {
      # --- RENDER DEFAULT DRILLDOWN BAR CHART ---
      output[[paste0("plot_", current_metric)]] <- renderPlotly({
        tryCatch({
          trigger <- global_trigger()
          plot_data <- summarized_data_long() %>%
            filter(Metric == current_metric) %>%
            filter(!is.na(Category))
          
          # --- *** FIX 2: Separated the 'if' checks *** ---
          # This avoids the logical(0) error
          
          # Check 1: Is the data frame empty?
          if (nrow(plot_data) == 0) {
            return(
              plot_ly() %>% 
                layout(
                  title = list(text = plot_title, x = 0.05), 
                  annotations = list(x = 0.5, y = 0.5, text = "No data available for this view", showarrow = FALSE, font = list(size = 14))
                )
            )
          }
          
          # Check 2: Are all values NA? (Now safe, since nrow > 0)
          if (all(is.na(plot_data$Value))) {
            return(
              plot_ly() %>% 
                layout(
                  title = list(text = plot_title, x = 0.05), 
                  annotations = list(x = 0.5, y = 0.5, text = "No data available for this view", showarrow = FALSE, font = list(size = 14))
                )
            )
          }
          # --- *** END OF FIX 2 *** ---
          
          max_val <- max(plot_data$Value, na.rm = TRUE)
          xaxis_range <- c(0, max_val * 1.3)
          
          p <- plot_ly(
            data = plot_data, y = ~Category, x = ~Value, type = "bar",
            orientation = 'h', name = current_metric_name,
            source = paste0("plot_source_", current_metric), # (Original drilldown source)
            texttemplate = '%{x:,.0f}', textposition = "outside",
            cliponaxis = FALSE, textfont = list(color = '#000000', size = 10)
          ) %>%
            layout(
              title = list(text = plot_title, x = 0.05), # Use unified title
              yaxis = list(title = "", categoryorder = "total descending", autorange = "reversed"),
              xaxis = list(title = "Total Value", tickformat = ',.0f', range = xaxis_range),
              legend = list(orientation = 'h', xanchor = 'center', x = 0.5, yanchor = 'bottom', y = 1.02),
              margin = list(l = 150)
            )
          
          p
          
        }, error = function(e) {
          # ... (Error handling unchanged) ...
        })
      })
    }
    # --- END of Conditional Plot Rendering ---
  })
  
  # --- 2. Create the UI Card Elements ---
  plot_cards <- map(selected_metrics, ~{
    current_metric <- .x
    current_metric_name <- names(metric_choices)[metric_choices == current_metric]
    
    # --- Conditional Summary Card ---
    summary_card_content <- NULL
    
    # --- *** FIX 1 (Copied): Added "Total.Schools" to this condition *** ---
    if (current_metric == "Modified.COC" || current_metric == "School.Size.Typology" || current_metric == "Shifting" || current_metric == "Total.Schools") {
      
      # --- Special handling for summary ---
      total_count <- tryCatch({
        if (current_metric == "Total.Schools") {
          summarized_data_long() %>%
            filter(Metric == "Total.Schools") %>%
            pull(Value) %>%
            sum(na.rm = TRUE)
        } else {
          nrow(filtered_data()) 
        }
      }, error = function(e) { 0 }) 
      
      # Use a different title for Total.Schools
      summary_title <- if (current_metric == "Total.Schools") {
        paste("Total", current_metric_name)
      } else {
        "Total Records in View"
      }
      
      summary_card_content <- card(
        style = "background-color: #FFFFE0; padding: 5px;", # Light yellow, tight padding
        tags$h5(
          summary_title, 
          style = "font-weight: 600; color: #555; margin-top: 2px; margin-bottom: 2px;" # Tighter margins
        ),
        tags$h2(
          scales::comma(total_count), 
          style = "font-weight: 700; color: #000; margin-top: 2px; margin-bottom: 2px;" # Tighter margins
        )
      )
      
    } else {
      
      total_val <- tryCatch({
        summarized_data_long() %>%
          filter(Metric == current_metric) %>%
          pull(Value) %>%
          sum(na.rm = TRUE)
      }, error = function(e) { 0 }) 
      
      summary_card_content <- card(
        style = "background-color: #FFFFE0; padding: 5px;", # Light yellow, tight padding
        tags$h5(
          paste("Total", current_metric_name), 
          style = "font-weight: 600; color: #555; margin-top: 2px; margin-bottom: 2px;" # Tighter margins
        ),
        tags$h2(
          scales::comma(total_val), 
          style = "font-weight: 700; color: #000; margin-top: 2px; margin-bottom: 2px;" # Tighter margins
        )
      )
    }
    # --- END of Conditional Summary Card ---
    
    # --- Build the final card for this metric ---
    bslib::card(
      full_screen = TRUE,
      card_header(current_metric_name),
      card_body(
        tags$div(
          style = "text-align: center; padding-bottom: 10px;",
          summary_card_content 
        ),
        plotlyOutput(paste0("plot_", .x))
      )
    )
  })
  
  # --- 3. Arrange the cards into the layout ---
  plot_grid <- do.call(
    bslib::layout_columns,
    c(list(col_widths = 4), plot_cards)
  )
  
  # --- *** NEW: Add the main title *** ---
  tagList(
    tags$h3("Interactive Education Resource Dashboard", 
            style = "text-align: center; font-weight: bold; margin-bottom: 20px;"),
    plot_grid # This is the grid of cards we just defined
  )
  
})