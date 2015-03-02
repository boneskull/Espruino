# espruino

Official Espruino modules packaged as an NPM module.
 
## Why?
 
So you can write your "apps" for Espruino like you would a NodeJS one.  

## Usage

```js
var dht = require('espruino/DHT11');

dht.connect(A0);

dht.read(function (a) {
  console.log('Temp is ' + a.temp.toString() + ' and RH is ' + a.rh.toString());
});

## Installation

```shell
$ npm install espruino
```

This will grab the stub, then fetch the *current, bleeding-edge* modules
from the [EspruinoDocs](https://github.com/espruino/EspruinoDocs) repo.

## How does this work?

It *doesn't*.  Not in NodeJS anyway.  You can get as far as using `require()`
on these modules, but that's about it.

However, by making them fully compatible with NodeJS' CommonJS implementation,
we can do stuff like use [Browserify](http://browserify.org) to wad up your 
script and required modules, minify, whatever else, then ship them off to your 
Espruino.

At least, in theory.  Still working on that last part.

## Notes

In these modules you see stuff like `0b01` which ostensibly means "1" in binary,
but NodeJS doesn't grok that, so we replace this with `parseInt("01", 2)`,
which results in the equivalent value.  I'm yet unsure of the implications of
this replacement, or why they were written in this manner originally.

In addition, the `atob()` function is not available without installing [a module](https://www.npmjs.com/packages/atob).  Espruino's implementation should not be overwritten at runtime, since we check to see if it's already present before requiring the 3p lib.

## TODO

- I think if `bundledDependencies` is used for the modules, you should be able
  to `require('DHT11')` instead of `require('espruino/DHT11')`.  Investigate.

## Author

[Christopher Hiller](http://boneskull.com)

## License

MIT
