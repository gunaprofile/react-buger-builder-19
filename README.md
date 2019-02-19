This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Navigation
### Toolbar
* Functional component , with mutiple reuseable sub component
```
const toolbar = ( props ) => (
    <header className={classes.Toolbar}>
        <div>Menu</div>
        <div>Logo</div>
        <nav>
            ...
        </nav>
    </header>
);

export default toolbar;
```
### Where to add toolbar ?

* In Layout component import toolbar component
```
import Toolbar from '../Navigation/Toolbar/Toolbar'
const layout = (props) => (
    <Aux>
        <Toolbar/>
        <div> SideDrawer With Backdrop</div>
        <main className={classes.Content}>
            {props.children}
        </main>
    </Aux>
);

export default layout;
```
### Logo component
```
import React from 'react';

import burgerLogo from '../../assets/images/burger-logo.png';
import classes from './Logo.css';

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={burgerLogo} alt="MyBurger" />
    </div>
);

export default logo;
```
* Import this Logo component in toolbar component

```
import MyLogo from '../../Logo/Logo';
const toolbar = ( props ) => (
    <header className={classes.Toolbar}>
        <div>Menu</div>
        <div className={classes.Logo}>
            <MyLogo />
        </div>
        <nav>
            ...
        </nav>
    </header>
);
```
* Now create NavigationItems to outsource in toolbar component.
```
const navigationItems = () => (
    <ul>
        <navigationItemLink>
            :
            :
        <navigationItemLink>
    </ul>
);

export default navigationItems;
```
* Now create NavigationItem to outsource in NavigationItems component.
```
const navigationItemLink = () => (
        <li>
            <a href="/"> A Link</a>
        </li>
        <li>
            <a href="/"> Anybody there ??</a>
        </li>
);

export default navigationItemLink;
```
* Now use the NavigationItems component in Toolbar component
```
import MyLogo from '../../Logo/Logo';
const toolbar = ( props ) => (
    <header className={classes.Toolbar}>
        <div>Menu</div>
        <div className={classes.Logo}>
            <MyLogo />
        </div>
        <nav>
            <NavigationItems/>
        </nav>
    </header>
);
```
### SideDrawer component
* Now create side drawer component 
```
const sideDrawer = ( props ) => {
    let attachedClasses = [classes.SideDrawer, classes.Close];
    if (props.open) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }
    return (
        <Aux>
            <Backdrop show={props.open} clicked={props.closed}/>
            <div className={attachedClasses.join(' ')}>
                <div className={classes.Logo}>
                    <Logo />
                </div>
                <nav>
                    <NavigationItems />
                </nav>
            </div>
        </Aux>
    );
};

export default sideDrawer;
```
### Where to add SideDrawer ?

* In Layout component import SideDrawer component
```
import SideDrawer from '../Navigation/SideDrawer/SideDrawer'
const layout = (props) => (
    <Aux>
        <Toolbar/>
        <SideDrawer/>
        <main className={classes.Content}>
            {props.children}
        </main>
    </Aux>
);

export default layout;
```
### Toggle effect to side bar
* For this first change Layout component into class based component from functional component.
```
class Layout extends Component {
    render () {
        return (
            <Aux>
                <Toolbar />
                <SideDrawer />
                <main className={classes.Content}>
                    { this.props.children}
                </main>
            </Aux>
        );
    }
}

export default Layout;
```
* Now add new state for showSideDrawer based on that toggle sideDrawer
```
class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState( { showSideDrawer: false } );
    }

    sideDrawerToggleHandler = () => {
        this.setState( ( prevState ) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        } );
    }
    render () {
        return (
            <Aux>
                <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
                <SideDrawer open={this.state.showSideDrawer}
                            closed={this.sideDrawerClosedHandler}/>
                <main className={classes.Content}>
                    { this.props.children}
                </main>
            </Aux>
        );
    }
}

export default Layout;
```
* Here SideDrawer open/close based on class state.
* Intially it will set to closed state
* sideDrawerToggleHandler function used to toggle state.
* To call sideDrawerToggleHandler we need a hamburger icon on click of this icon we will call sideDrawerToggleHandler.

### DrawerToggle Component (Hamburger Icon)
* Here we will design hamburger icon using div class
```
import React from 'react';

import classes from './DrawerToggle.css';

const drawerToggle = (props) => (
    <div className={classes.DrawerToggle} onClick={props.clicked}>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export default drawerToggle;
```
### Where to use Hamburger Icon
* Obiviously we will add Hamburger Icon (DrawerToggle component) in toolbar component

```
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';

const toolbar = ( props ) => (
    <header className={classes.Toolbar}>
        <DrawerToggle clicked={props.drawerToggleClicked} />
        <div className={classes.Logo}>
            <Logo />
        </div>
        <nav className={classes.DesktopOnly}>
            <NavigationItems />
        </nav>
    </header>
);

export default toolbar;
```
* here onClick (DrawerToggle component Hamburger Icon) -> drawerToggleClicked (Toolbar component) -> sideDrawerToggleHandler (Layout component) based on that sideDrawer will show/hide.






