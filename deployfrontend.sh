rsync -r app/ docs/
rsync build/contracts/*.json docs/
git add .
git commit -m "adding frontend files to Github pages"
git push