This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
### What is webpack ?
* Webpack is a bundler but it actually is more than that
* A bundler alone would just concatenate files, webpack does that but it also allows you to optimize your files and you hook in various plugins and so-called loaders to also transform your files
* for example transpile next generation javascript to current generation javascript.(ES5 - ES6)
* It will combine and bundle all js files into single js file likewise same for css and image also.It analyzes connections between these files like imports and then bundles everything together, allows you to optimize it.And already i said it will some other additional logics like transpile from older to new version.
### How it works behind the scene ??

* It has four important things..
* First one is it always needs atleast one entry point . it may multiple also possible. This could be our app.js file, our root javascript file which mounts our react application to the dom, which calls react dom render for example, it needs this file since it then analyzes the dependencies.
*  so webpack can build up a dependency graph starting with that root entry file so it can understand which files make up our application
* if we give it our entry file. It then analyzes all the dependencies and bundles them together into an output we specify it like a bundle.js file in a dist folder, we specify the file name and where it should go.
* And there it will put all these dependencies into that file, correctly ordered and in one concatenated output file.
* In between input and output there are two other important features we can utilize.
* For one there are so-called loaders, loaders are applied on a per file level so we can for example say all javascript files should get handled by loaderX, all css files should get handled by loaderY,babel-loader and css-loader are two popular examples which get used in a lot of projects. Loaders are file dependent.
* Next is We also then have plugins where loaders are applied on a per file basis, plug instead take the concatenated files, so the bundle but before it's written to the output.Here we can apply some general transformations or optimizations like uglify.   

### Basic workflow requirement.

* Compile Next Generation javascript feature - We certainly want to support next generation javascript features so we need to be able to compile that
next generation javascript code to current gen javascript code which runs in all major browsers these days.
* Handle JSX  - Additionally we want to be able to handle jsx so that we can use jsx in our script files, in our react project.
* css auto-prefixing - so that we can write simple css rules and get automatic prefixing so that it supports the best syntax in all browsers our applications supports.
* Support Image Import - And we also want to support images of course, we should be able to import images as we did it in our
create react app and then use it to our template.
* Finally we want to optimize the code, before we built that bundler or we spit it out,it should be optimized to shrink our javascript code to as small of a size as possible.
* These are the core requirements , Next refer !!!!! webpack-react github
