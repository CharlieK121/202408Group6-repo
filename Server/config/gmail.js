// The user profile under the DB will have an email address
// generate a message to send to user on first week of semester
// General Format
//  Hello , {UserName}
//  Welcome to the first week of this CSULA Semester!
//  Today, you have:
    //  Class 1 @ Time AM - Time AM
    //  Class 2 @ Time AM - Time AM
    //  Class 3 @ Time AM - Time AM
// Be sure to use Scholar Path to find your way there!


//  Retrieve the user email from db
//  GOOGLE API
// create new Draft: 	POST /gmail/v1/users/{userId}/drafts
// POST /upload/gmail/v1/users/{userId}/drafts
// Creates a new draft with the DRAFT label.

// Check Day check number of emails sent out
// Send out correct message:	   POST /gmail/v1/users/{userId}/drafts/send
                                // POST /upload/gmail/v1/users/{userId}/drafts/send
