<template>
	<div class="p-3">
		<h1 class="text-center my-3">About GSW ComElec</h1>
		<section id="intro" class="p-3">
			<h2>
				Introduction
			</h2>
			<p>
				The <strong>ComElec</strong> application is meant to assist with different stages of the process of GSW standing committee election. The election runs annually, based on preferences of participating <i>faculty members</i> and expert opinions of members of the <i>GSW Faculty Senate</i>. In short the process is comprised from two phases: (i)	early in the cycle, ordinary faculty provide personal preferences for their next year committee assignment, then, (ii) the GSW Faculty Senate processes all individual preferences along with other guidances and constraints to make the final service assignment for every individual faculty.
			</p>
			<p>
				The application has 2 interfaces
			</p>
			<ul>
				<li>
					Public interface for all faculty members to use to submit committee preferences. Up to 3 committees can be selected.
				</li>
				<li>
					Admin interface for the members of the Faculty Senate allowing for the assisted distribution of all faculty into the set of existing committees.
				</li>
			</ul>
		</section>
		<section id="howto" class="p-3">
			<h2>
				How it works
			</h2>
			<p>
				<strong>For regular users (faculty)</strong>. The process starts from allowing a faculty member to identify herself by means of providing official GSW email address. That address is cooked up against faculty/staff user directory to identify the real user's name. On the next step the history of previous committee services for this given user is examined to display the list summarizing committee assignments for the last 3 years.
			</p>
			<p>
				The user then is asked to choose the preference for 3 committees for the next year cycle. Once preference is submitted a confirmation email will be sent to the associated email address. A confirmation link from the email has to be followed for the purposes of integrity assurance.
			</p>
			<p>
				The process can be repeated arbitrary number of times before the set deadline. The deadline can be estimated as a week before the GSW Planning Week which is normally scheduled in early days of August.
			</p>
			<p>
				<strong>For administrators (members of the Faculty Senate)</strong>. Authorized members of the Senate can use their CanesNET credentials to access administrative interface allowing for 3 basic actions:
			</p>
			<ol>
				<li>
					Observe the summary of all preferences, expressed by faculty members in organized and structured format.
				</li>
				<li>
					Make adjustments by enrolling additional members to certain committees and assigning ex-officio roles to selected new enrollments
				</li>
				<li>
					Save and publish all modifications to appear on report page
				</li>
			</ol>
			<p>
				Administrators are also responsible for a number of maintenance tasks that can also be performed on administrative interface:
			</p>
			<ol>
				<li>
					Update list of active administrators
				</li>
				<li>
					Periodically synchronize application with GSW employee directory.
				</li>
				<li>
					Update information about GSW standing committees
				</li>
				<li>
					Roll out the application to the next year cycle
				</li>
			</ol>
		</section>
		<section id="about" class="p-3">
			<h2>
				About this application
			</h2>
			<p>
				This application is an open source software developed by <a href="mailto:simon.baev@gsw.edu">Dr. Simon Baev</a> from the Department of Computer Science for the needs of Campus community. The source code of the application is available on GitHub at <a href="https://github.com/gswcm/comelec">https://github.com/gswcm/comelec</a>
			</p>
			<p>
				Feel free to file an <a href="https://github.com/gswcm/comelec/issues">issue</a> directly on GitHub should you notice some bug(s) or have a request for features.
			</p>
		</section>
	</div>
</template>

<style>
	p {
		text-align: justify !important;
		margin-left: 1em;
	}
</style>
