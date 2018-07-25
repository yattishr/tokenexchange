rsync -r app/ deploy/
rsync build/contracts/*.json deploy/
git add .
git commit -m "adding frontend files to Github pages"
git push