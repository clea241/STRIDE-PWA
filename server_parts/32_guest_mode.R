# ===========================================
# GUEST MODE MODULE
# ===========================================

observeEvent(input$guest_mode_btn, {
  showModal(modalDialog(
    title = "Guest Information",
    easyClose = FALSE,
    footer = tagList(
      modalButton("Cancel"),
      actionButton("submit_guest_info", "Continue", class = "btn btn-primary")
    ),
    textInput("guest_name", "Full Name"),
    textInput("guest_email", "Email Address (optional)"),
    textInput("guest_org", "Organization / Affiliation"),
    textAreaInput("guest_purpose", "Purpose of Visit",
                  placeholder = "e.g., exploring dashboards, data reference, etc."),
    width = 500
  ))
})

# When guest info is submitted
observeEvent(input$submit_guest_info, {
  req(input$guest_name, input$guest_purpose)
  
  guest_entry <- tibble::tibble(
    Timestamp = as.character(Sys.time()),
    Name = input$guest_name,
    Email = input$guest_email,
    Organization = input$guest_org,
    Purpose = input$guest_purpose
  )
  
  # Use separate Google Sheet for guests
  GUEST_SHEET_ID <- "https://docs.google.com/spreadsheets/d/1SvlP7gyfgmymo10hpstKyYs2N9jErCg5tqrmELboTRg/edit?gid=0#gid=0"
  
  tryCatch({
    googlesheets4::sheet_append(ss = GUEST_SHEET_ID, data = guest_entry)
    removeModal()
    showNotification("Guest record saved. Welcome!", type = "message")
    # ✅ Hide login and show STRIDE2 section
    shinyjs::hide("page_ui")
    shinyjs::show("mgmt_content")
  }, error = function(e) {
    showNotification(paste("Error saving to Google Sheets:", e$message),
                     type = "error")
  })
})
