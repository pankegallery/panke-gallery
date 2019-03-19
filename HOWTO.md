# How-tos and regularly used commands 

## Crucial Commands

### From the original documentation

`$ gatsby develop`

Run the project locally with live reload in development mode.

`$ npm run build`

Run a production build into `./public`. The result is ready to be put on any static hosting you prefer.

### For developement environment

`$ ./develop_init.sh`

Remove cache and rerun gatsby develop (cache needs to be deleted to see changes made on Contentful)

`$ sass --watch src/styles/panke.scss:src/styles/panke.css`

Couldn't get SASS running with Gatsby v1. Watch creates css in Terminal independetly from React. Executed from root folder

## Git notebook

Create branch:

`$ git checkout -b XXX`

Push branch:

`$ git push`

then follow instruction and create branch online:

e.g. `$ git push --set-upstream origin XXX`

When merging branches, merge XXX into YYY where XXX is new and YYY is old(master).

```
$ checkout YYY

$ merge --no-ff XXX

```
