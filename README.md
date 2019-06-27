This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
### Deployment steps
* STEP 1: check and Adjust basepath
```jsx
<BrowserRouter basename="/my-app"> 
```
* STEP 2: Build and optimize Project
```jsx
npm run build in create-react-app project
```
* STEP 3: Server must always serve index.html (also for 404 cases)
    * Ensure routing working correctly
* STEP 4: Upload the build artifacts to(static) server (get from step 2)

### Example Firease hosting 
* sudo npm install -g firebase-tools
* assin public directory as build
* The follow the firebase steps..