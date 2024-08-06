# Go to correct directory if executed from another directory
cd ~/Development/panke-gallery

# Generate random 5-digit number
random_number=$((RANDOM % 90000 + 10000))
alias_name="panke-deploy-preview-$random_number"

# Delete cache and build
# rm -fr ./.cache && gatsby build
netlify build

# Ask for deploy
read -p "Deploy preview? " -n 1 -r deploy_yes
echo    # (optional) move to a new line
if [[ $deploy_yes =~ ^[Yy]$ ]]
then
  # Deploy preview
  netlify deploy --alias="$alias_name"
  
  # Open browser
  if [[ $? -eq 0 ]]; then
    echo "Preview deployed successfully!"
    open "https://$alias_name--pankegallery.netlify.app"
  fi

  # Ask for live
  read -p "Go live? " -n 1 -r live_yes
  echo    # (optional) move to a new line
  if [[ $live_yes =~ ^[Yy]$ ]]
  then
    # Deploy preview
    netlify deploy --prod
  fi
# Otherwise serve locally
else
  gatsby serve &   # Start Gatsby server in the background
  # Wait for server to start
  sleep 5
  open "http://localhost:9000"
fi
