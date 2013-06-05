# Nerd Dashboard #
This is a Single Page Application developed with AnguarJS (client side javascript framework) and a node.js plus Express for the server.
Basically the server initially serves the files required by AngularJS to bootstrap the application and, after this first interaction, the communication between the tiers is made with REST APIS.

## Development ##
Nerd Dashboard has been developed using a few cool tools that make the developer life easier.
Unfortunately this requires a bit of initial configuration but will help a lot in the daily development work. Unfortunately there was a little time to setting up the environment and therefore there are only some features implemented.

One of the first tool to be aware of is <strong>Grunt</strong> which is a Javascript Task Runner. Grunt allows to automate repetitive tasks like minification, compilation, unit testing, linting, etc, the easier your job becomes.
To have an overview of Grunt and to understand how it works you can find a lot of resources on [gruntjs.com/](http://gruntjs.com/)

Another tool intensively exploited is <strong>Compass</strong>, a CSS Authoring Framework built on Sass ( an extension of CSS3 which adds nested rules, variables, mixins, selector inheritance).

I also strongly suggest to use <strong>Yeoman 1.0</strong> :<CITE>a collection of tools and best practices working in harmony to make developing for the web even better</CITE>. Actually Yeoman could be considered a workflow that comprise three tools : yo (the scaffolding tool), grunt (the build tool) and bower (for package management).
As we can see we already talked about Grunt, so the last tools we have to talk about are yo and bower.

The first allows to scaffolds out a new application, writing your Grunt configuration and pulling in relevant Grunt tasks that you might need for your build ( in our case allowed to first scaffold an AngularJS application, write the Gruntfile and moreover allows with a simple instruction to scaffold new view, controllers, services for the web application).
<strong>Bower</strong> is another great tool and allows to easily face the front-end package management: it is basically a package manager for the web.
Given this brief overview we can describe how to built our development workflow.

### Development workflow ###
Once you have this repository locally, of course, you need nodejs and Git, plus Ruby and Compass installed on your machine.
Then you need to install <strong>Yeoman</strong> with <strong>Grunt</strong> and <strong>Bower</strong>:
This will install the recommended tools globally.
```shell
npm install -g yo grunt-cli bower
```

Then you need to install angular-generator
```shell
npm install -g generator-angular
```
You can have an overview on how this generator works on [angular-generator](https://github.com/yeoman/generator-angular/)

Now that you have all this stuff installed on your workstation, inside the root of the project launch:

```shell
npm install
```
to install all the dependencies of our application.
The Nerd Dashboard DBMS could be changed in the file app/config/mysql.js.
Now you have all you need to start Nerd Dashboard, you can just launch

```shell
grunt myserver
``` 
and you will have your server listening on port 0.0.0.0:3000.
Of course you can change the configuration "hacking" on the configuration on Gruntfile.js".

Basically now we have our application running and every time we make a change to our project Grunt take care to restart the Server, compile .sass files, .coffe files and cleaning our directory project.

## Production ##

Unfortunately there isn't yet a Grunt task to take care of the build production and to make running the server you have to take the files compiled by grunt and put it in the right places ( looking the Gruntfile it's easy to understand the structure of our application directory tree) and slightly modify server.js to make it listening on the right hostname and port.
Then you can launch:

```shell
node server.js
``` 



