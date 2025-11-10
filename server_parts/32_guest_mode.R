# ===========================================
# GUEST MODE MODULE
# ===========================================

observeEvent(input$guest_mode_btn, {
  showModal(modalDialog(
    title = "Guest Information",
    easyClose = FALSE,
    footer = tagList(
      modalButton("Cancel"),
      shinyjs::disabled(
        actionButton("submit_guest_info", "Continue", class = "btn btn-primary")
      )
    ),
    textInput("guest_name", "Full Name"),
    textInput("guest_email", "DepEd Email Address", 
              placeholder = "e.g., juan.delacruz@deped.gov.ph"),
    
    # 💡 MOVED and STYLED the email message
    tags$small(id = "guest_email_msg", style = "color: #dc3545; display: block; margin-top: -10px; margin-bottom: 10px;"), 
    
    textInput("guest_org", "Organization / Affiliation"),
    textAreaInput("guest_purpose", "Purpose of Visit",
                  placeholder = "e.g., exploring dashboards, data reference, etc."),
    
    # 💡 ADDED the purpose message element
    tags$small(id = "guest_purpose_msg", style = "color: #dc3545; display: block; margin-top: -10px;"), 
    
    width = 500
  ))
})

# 💡 NEW OBSERVER: Validate guest form inputs
# 💡 REVISED OBSERVER (v3): Validate guest form inputs
observe({
  # 1. Check Name
  name_ok <- !is.null(input$guest_name) && nzchar(trimws(input$guest_name))
  
  # 2. Check Email
  email_val <- input$guest_email
  email_ok <- !is.null(email_val) && endsWith(trimws(email_val), "@deped.gov.ph")
  
  # 3. 💡 NEW: Check Purpose
  purpose_val <- trimws(input$guest_purpose)
  purpose_length_ok <- nchar(purpose_val) >= 10
  
  # --- THIS IS THE NEW RULE ---
  # Check if the text contains any vowel (a, e, i, o, u, y)
  purpose_has_vowels <- grepl("[aeiouy]", purpose_val, ignore.case = TRUE)
  
  # Purpose is only OK if it meets BOTH conditions
  purpose_ok <- purpose_length_ok && purpose_has_vowels
  
  # 4. Enable/disable button logic
  if (name_ok && purpose_ok && email_ok) {
    shinyjs::enable("submit_guest_info")
    shinyjs::html("guest_email_msg", "")  # Clear email error
    shinyjs::html("guest_purpose_msg", "") # Clear purpose error
  } else {
    shinyjs::disable("submit_guest_info")
    
    # --- Show email error ---
    if (!email_ok && !is.null(email_val) && nzchar(email_val)) {
      shinyjs::html("guest_email_msg", "Email must be a valid @deped.gov.ph address.")
    } else {
      shinyjs::html("guest_email_msg", "") # Clear error if field is just empty
    }
    
    # --- 💡 SHOW NEW PURPOSE ERROR ---
    # Show error only if user has started typing but it's invalid
    if (!purpose_ok && !is.null(input$guest_purpose) && nzchar(purpose_val)) {
      shinyjs::html("guest_purpose_msg", "Purpose must be at least 10 characters and include recognizable words (with vowels).")
    } else {
      shinyjs::html("guest_purpose_msg", "") # Clear error if field is just empty
    }
  }
})

# When guest info is submitted
observeEvent(input$submit_guest_info, {
  
  # 💡 UPDATED: Added input$guest_email to req()
  req(input$guest_name, input$guest_purpose, input$guest_email)
  
  # 💡 ADDED: Server-side validation as a fallback
  if (!endsWith(input$guest_email, "@deped.gov.ph")) {
    showNotification("Invalid DepEd Email. Please check your entry.", type = "error")
    return() # Stop execution
  }
  
  guest_entry <- tibble::tibble(
    Timestamp = as.character(Sys.time()),
    Name = input$guest_name,
    Email = input$guest_email, # 💡 This is now the required DepEd email
    Organization = input$guest_org,
    Purpose = input$guest_purpose
  )
  
  # Use separate Google Sheet for guests
  GUEST_SHEET_ID <- "https://docs.google.com/spreadsheets/d/1SvlP7gyfgmymo10hpstKyYs2N9jErCg5tqrmELboTRg/edit?gid=0#gid=0"
  
  tryCatch({
    googlesheets4::sheet_append(ss = GUEST_SHEET_ID, data = guest_entry)
    removeModal()
    showNotification("Guest record saved. Welcome!", type = "message")
    
    # This existing logic is correct
    user_status("authenticated")
    authenticated_user("guest_user@stride") 
    
  }, error = function(e) {
    showNotification(paste("Error saving to Google Sheets:", e$message),
                     type = "error")
  })
})