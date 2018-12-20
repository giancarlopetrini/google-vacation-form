# google-vacation-form
Simple script and integration for google forms, and calendar (Google's environmnet doesn't support ES6/7 features as of yet: https://issuetracker.google.com/issues/36764074)

### Set Up
1. You'll need to create a calendar with proper access permissions, and sharing settings. Ideally, internal to your organization only.
2. Create a form, send its responses to a Google Sheet.
3. In that Google Sheet, create a script editor, copy and paste this script (make sure to update emails in test functions)
4. Create project trigger (via toolbar in script editor), and point to onFormSubmit function. 
5. Run the tests, and approve the prompted authorization requests (for editting Google Sheets, Calendar, and sending mail)
