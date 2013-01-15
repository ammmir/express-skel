# Express 3 Application Skeleton

This is a barebones node.js application built on the [Express](http://expressjs.com/) web application framework. It includes sane defaults such as a [Redis](http://redis.io/)-backed session store, and optionally [socket.io](http://socket.io/), also backed with a Redis store.

To encourage modular applications, the `lib/module` directory structure can be used. This involves creating `lib/module/index.js` which is `require()`'d by the application in `lib/http/application.js` or anywhere else. A module could define a set of URL endpoints, models, or arbitrary functions. Modules can also be nested, but avoid nesting more than two levels deep. It is up to you keep your application within the spirit of this design. Think of these modules as decoupled design rather than reusable components.

Grab a copy for yourself and start hacking away on a shiny new app:

    git clone git://github.com/ammmir/express-skel.git
    rm -rf express-skel/.git
    mv express-skel myapp

Customize `app.js`, `package.json`, and sub-application modules under `lib`. When running your app, be sure to set up environment variables such as `SESSION_SECRET`, `REDIS_URL`, and `NODE_ENV`.