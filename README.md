This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Authentication

#### How Authentication works in SPA ? (Refer image in ref folder)

* We have a server and we have our single page application running in the browser. Now the single page application sends the authentication data to the server because we probably have a sign up or a sign in page in our SPA and therefore we get data like the e-mail address and the password and we send this to the server to validate it and this is also where we store our persistent data, in the database on the server.

* This can be any server, any restful API to be precise, this is what we typically communicate with when using single page applications. That server then send something back and you could think that's a session but since the server in a SPA world typically is a stateless restful API, we're not getting back
a session because the server doesn't care about the different clients connecting to him.

* Instead we get back a token, you can think of that token as a javascript object and code it as json, json web tokens are the typical form of tokens you get.So it's a javascript object in the end you can say and this javascript object now has to be stored on the client,

* for example in local storage. We could also store it in our redux store but there, it will be lost when ever the user refreshes the page.

* So we typically use local storage since that persists page refreshes and allows us to fetch that token even if the user did leave and revisit our page, so that we can leave the user are logged in if we want.

* And what do we need this token for then?

* Well, imagine we're making requests to some protected resource on the server,like for example we tried to change our password or we want to create a new blog post, such requests of course are only allowed to authenticated users

* and since we don't constantly check the authentication status on the server, we have no session there.We pass the token along with requests to such protected resources, that token and that's important is created by the server and in a way that the server can verify if it's a valid token created by the server or not.

* So that we can't fake such a token on the client,we can't create it there and send to the server,that would not work.

* Only the tokens sent by the server is accepted on the server.

* So this is how we then authenticate ourselves on subsequent requests after receiving that token and that's the pattern we're going to implement in this module.

* Now as I said, we'll use firebase here since we used it as a backend because it's so easy to set upbut that pattern is going to be the same no matter which backend you use, as long as it's a restful API. 

#### Auth dynamic form creation
* Create dynamic form .. refer Auth.js
* Once form details added wrap it with router in app.js
```jsx
import Auth from './containers/Auth/Auth';
    ....
    ....
<Route path="/auth" component={Auth} />
```
* Also do changes in NavigationItems component
```jsx
<NavigationItem link="/auth">Authenticate</NavigationItem>
```
* Refer auth store related changes like action creators and action types.. because we want to dispatch an action when submit pressed.

