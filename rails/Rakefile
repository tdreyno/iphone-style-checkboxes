require 'rake'
require 'bundler/gem_tasks'

desc "Update the gem with the latest files"
task :update do
  # Copy the js file and require jQuery
  js_content = File.read "../jquery/iphone-style-checkboxes.js"
  f = File.new("vendor/assets/javascripts/ios-checkboxes.js", "w")
  f.write("//= require jquery\n\n#{js_content}")
  f.close

  # Copy the images
  cp_r "../images/", "vendor/assets/"

  # Copy CSS and make sure it references the images via assets pipeline
  css_content = File.read "../style.css"
  pattern = /url\('images\/([^']+)'\)/
  css_processed = css_content.gsub(pattern) {|m| "url('<%= image_path \"#{$1.sub(/\?.*/, '')}\" %>')" }
  f2 = File.new("vendor/assets/stylesheets/ios-checkboxes.css.erb", "w")
  f2.write(css_processed)
  f2.close
end
