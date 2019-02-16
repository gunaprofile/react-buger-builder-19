This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Layout Components
* Create layout component and wrap it with Aux component;

```
import React from 'react';
import Aux from '../../hoc/Aux'

const layout = (props) => (
    <Aux>
        <div>Toolbar, SideDrawer, Backdrop</div>
        <main>
            {props.children}
        </main>
    </Aux>
);

export default layout;
```
* Import layout in app.js and render.
* In the previous branch we imported Googlefonts in index.html, here in index body css add your class.

