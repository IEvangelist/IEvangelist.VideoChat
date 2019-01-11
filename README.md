# IEvangelist - Video Chat (Powered by Twilio)

This is a demo app built for the purpose of a Twilio blog post. This application uses several key technologies that are intended to be highlighted.

 1. `ASP.NET Core`
   1. `Web API`
     1. Issues JSON Web Tokens (JWT) for client-side __Twilio Video__ interactions
	 2. Offers various end-points for Room and Participant details
   2. `SPA Web-Server`
	   1. Serves up the `Angular` application
   3. `SignalR`
	   1. This is used for pushing from the server to the client, specific updates
 2. `Angular`
	 1. Various modules, components and services making up a video chat application
	 
## Configuration

There are several configurations that need to be made in order for this application to function correctly. You'll need to sign up for a __Twilio Programmable Video__ account and get some API credentials.

| # | Name | Environment Variable Key  | 
|--:|:--|:--|
| 1 | `AccountSid` | `TwilioSettings__AccountSid` |
| 2 | `ApiKey` | `TwilioSettings__ApiKey`  |
| 3 | `ApiSecret` | `TwilioSettings__ApiSecret`  |
