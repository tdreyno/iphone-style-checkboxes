# iOS Style Checkboxes for Rails 3.1


This gem provides an easy way of using [iOS style checkboxes](https://github.com/tdreyno/iphone-style-checkboxes).


## Install

Please be sure to have [Rails Assets Pipeline](http://guides.rubyonrails.org/asset_pipeline.html) enabled.

Add the following to your `Gemfile`, preferably inside the assets group:

```ruby
gem 'ios-checkboxes'
gem 'jquery' # This is required by ios-checkboxes
```

Then as usually:

```bash
$ bundle install
```

## Usage

After installation, all you need to do is to require `ios-checkboxes` inside JavaScript/CoffeeScript and CSS files.

Usually you would add this to your `app/assets/javascripts/application.js` file:

```javascript
//= require ios-checkboxes
```

This will also automatically require `jquery`.

And also update your `app/assets/stylesheets/applications.css` to inlude `ios-checkboxes`

```css
/*
 *= require ios-checkboxes
 *= require_self
*/
```

That's it. Now you can write stuff like `$(".on-off").iphoneStyle()`.

## Development

- Source hosted at [GitHub](https://github.com/tdreyno/iphone-style-checkboxes). See `rails` directory.
- Report issues and feature requests to [GitHub Issues](https://github.com/tdreyno/iphone-style-checkboxes/issues)

To update the gem with the latest files do:

```bash
cd rails
rake update
# Now go and update the version manually in lib/ios-checkboxes/version.rb
git add .
git commit -m 'update rails gem'
rake release
```
