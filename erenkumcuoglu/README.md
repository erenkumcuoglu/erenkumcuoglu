# Deploy bundle — career-journey rename + assets

Copy the contents of this folder into your repo at:
  erenkumcuoglu/erenkumcuoglu/

Then DELETE this old file from the repo:
  erenkumcuoglu/erenkumcuoglu/professional-milestones.html

Files in this bundle:
- career-journey.html         (NEW — the main page)
- images/                     (NEW — campaign photos referenced by career-journey.html)
- index.html                  (UPDATED — link /professional-milestones → /career-journey)
- eren-kumcuoglu.html         (UPDATED — footer link updated)
- sitemap.xml                 (UPDATED — new URL)
- netlify.toml                (UPDATED — adds 301 redirect from /professional-milestones)
- robots.txt                  (NEW — opens site to all AI crawlers + sitemap)
- llms.txt                    (NEW — short LLM summary)
- llms-full.txt               (NEW — full LLM profile)

Git steps (run from your local clone):
  cp -r deploy/* path/to/erenkumcuoglu/erenkumcuoglu/
  rm path/to/erenkumcuoglu/erenkumcuoglu/professional-milestones.html
  git add .
  git commit -m "Rename professional-milestones → career-journey + add images, robots, llms"
  git push
