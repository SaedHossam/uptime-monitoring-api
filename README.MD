# Website monitoring API 
uptime monitoring RESTful API server which allows authorized users to enter URLs they want monitored, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

### Demo Video
https://www.youtube.com/watch?v=3wUnIypywxw

## Usage
- clone or download the repo
- run ```npm install```
- create a new file called **.env** in the root file
- follow up with this [tutorial](https://www.youtube.com/watch?v=-rcRf7yswfM&list=LL&index=3) to setup Email Services
- add this variables with your credantials

```
PORT = 3000
DB_URI = YourMongoConnectionString
SECRET = LoginToken
EMAIL_SECRET = ConfirmationToken
GMAIL_USER = yourmail@gmail.com
CLIENT_ID = ******.apps.googleusercontent.com
CLIENT_SECRET = ******
REFRESH_TOKEN = ********
REDIRECT_URI = https://developers.google.com/oauthplayground
AUTHORIZATION_CODE = ******

```