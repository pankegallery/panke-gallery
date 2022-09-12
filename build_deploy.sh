cd ~/Development/panke-gallery

# Delete cache and build
# rm -fr ./.cache && gatsby build
netlify build

# Ask for deploy
read -p "Deploy preview? " -n 1 -r deploy_yes
echo    # (optional) move to a new line
if [[ $deploy_yes =~ ^[Yy]$ ]]
then
  # Deploy preview
  netlify deploy
  
  # Aks for live
  read -p "Go live? " -n 1 -r live_yes
  echo    # (optional) move to a new line
  if [[ $live_yes =~ ^[Yy]$ ]]
  then
    # Deploy preview
    netlify deploy --prod
  fi
# Otherwise serve locally
else
  gatsby serve
fi

