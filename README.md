# Project Heinzelmannchen

"Accelerate risk" is a common theme in managing complex research and development projects.  The idea sounds simple enough - identify the biggest risks and go after them first. Moving potentially existential risks to the beginning of the project is the best use of R&D dollars because, if it simply can't be done, you don't want to find that out at the end after burning through most of the budget. Even in the absence of existential risks it is still wise to move the biggest risks up from so that the team is always going "down hill" with the wind at their backs. If done correctly then the end of the project is relatively straight forward and everyone can reminisce about the pain behind them.

So the question, then, is how do you define risks? For us it comes down to dependencies between tasks, issues, bugs, etc.  If you have a piece of work and you know exactly how to do, it doesn't depend on completing any other piece of work, there is no integration work required, then that is not particularly risky.  Invert any one of those suppositions and suddenly there is a dependency you need to clear before you can declare success.

An alternative approach is to ask "how long do you think it will take you to complete X" where X is some piece of work. The longer the estimate the more risk.  The problem is that humans are epically horrible at estimating how long a piece of creative work will take. What is actually happening when a human is presented with a request for an estimate is they perform an on-the-fly dependency analysis and attempt to aggregate the cost estimate for each item in their ad-hoc dependencies graph.  They will tend to be more correct when they have done X many times before, know what all the dependencies are, and know how long it took to clear each depedency; in other words, very low risk.

![heinzelmannchen](https://raw.githubusercontent.com/cotiviti/heinzelmannchen/master/app/images/screenShot.png)

We've decided to just jump to the end and created this handy tool enabling us to visualize the dependencies between our issues. For each task we ask "is this dependent on something else?" If the answer is no then we are at leaf node in the graph. Of course we are wrong about that most of the time so when we discover a new dependency we immediately create an issue and add in the dependencies.  So now we have a workable definition of risk - riskier issues have more incoming dependencies.  This vears in to some interesting graph analysis that we haven't gotten in to yet.

Some notes on the colors.  We use priority tags to help us triangulate ourselves with our customer's business needs. Heinzelmannchen uses those to color code each circle - red is high, yellow is medium, dark blue is low.  The light blue circles are milestones. The green outline on some of the issues highlights those issues that have been changed in the last 24 hours.

To add dependencies simply add this section to the tail end of each issue -
```
### Dependencies
* [ ] #X
* [ ] #Y
* [ ] https://github.com/ORG/REPO/issues/Z
```
Where X, Y, Z are issue ID's.  We created this handy link to speed up the process -
```
https://github.com/YOUR-ORG/YOUR-REPO/issues/new?&body=%23%23%23%20Description%0A%0A%23%23%23%20Acceptance%20Test%0A%0A%23%23%23%20Dependencies%0A%0A%2A%20%5B%20%5D%20%23%0A%2A%20%5B%20%5D%20%23%0A%2A%20%5B%20%5D%20%23%0A%2A%20%5B%20%5D%20%23%0A%2A%20%5B%20%5D%20%23
```
Where YOUR-ORG is your organization and YOUR-REPO is your repo.  Yes, GitHub provides a a list of issues that have mentioned this one but we can't guarantee that those mentions are dependencies or something else so we decided to be more explicit.

If you want to try heinzelmannchen on your own repositories, visit https://cotiviti.github.io/heinzelmannchen/login.html to authorize your GitHub credentials and then change the `repo` query parameter to reflect your organization and repository.

There are lots of improvements that can make this capability even more cool and we can't wait to see what you do with it :)
