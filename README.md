# LIRS_drone_web_model
Web application for imitation simulation of security drones.
---
## Demo
![](demo.gif)

## Description

The purpose of this application is to simulate UAV (drone) behaviour (blue dot) in security application and determine how many ground stations (blue squares) are necessary to secure the whole inner perimeter (black squares with blue lines) from an intruder (purple dot). 

Each ground station can charge and store up to 3 drones (dots near the blue square). When an intruder is crossing the perimeter, a drone from the nearest station is dispatched to follow and watch over the intruder. When the drone is running out of charge (green line), the next drone from the nearest station is dispatched and the previous drone could return to the closest free station.

Left mouse click places/removes a perimeter point, right mouse click places/removes a ground station. You can run the simulation and change the simulation and drone speed.

## Technologies used

- Meteor v1.4 with Blaze frontend as the full-stack framework
- D3.js for the drones animation
- Materialize.css out of the box material styled web elements
- General HTML/JS/CSS

## Developer guides

To get started, you need to do the following:
1. install git and [meteor](http://meteor.com) on your local machine.
2. `git clone [github_link]` — clone this repo to your local machine
3. `cd [repo_dir]`
4. `meteor npm install` — to install all packages to your local machine
5. run `meteor` in console and then open http://localhost:3000/ in your browser, in order to check that everything works fine

If you want to implement some feature:
1. `git checkout develop` — it is recommended to derive your feature from the develop branch
2. `git pull` — don't forget to refresh your local repo!
3. `git checkout -b [feature_<some_meaningful_feature_name>]` — create and switch to a new branch. It is recommended to call it like "feature_<some_meaningful_feature_name>"
4. ONLY NOW you can code your feature
5. `git add .` — stage all your work for commit
6. `git commit -m "<Describe_what_you_have_done>"` — commit changes
7. `git push --set-upstream origin [feature_<some_meaningful_feature_name>]` — to push your local branch to the github

## Credits

This web application was created by the team of Innopolis University students as their coursework on Theoretical Computer Science course in spring 2017.

The team:
- Igor Danilov @cadestian - Product owner
- Aleksandr Fomenko @alex4men - Team lead, meteor programmer
- Ilya Voloshanovskiy @ilyavy - JS/meteor programmer
- Alexey Rodionov @Stayer - JS programmer
- Iskander Sitdikov @IceKhan13 -  JS programmer
- Oleg Kulaev @olegkulaev - Frontend programmer
- Andrey Polovinkin @anpolo - JS/meteor programmer
- Arseniy Chernov @chernovars - JS programmer
- Marat Shikhamov @Mrat09 - JS programmer
