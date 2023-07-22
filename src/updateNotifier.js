export function checkForUpdates() {
  const versionUrl = 'https://chuckterry.me/projects/invictus/version.txt';
  const version = globalThis?.invictus?.version;
  if (document.querySelector('#usernavigation input[name=setmode]')?.checked !== true) return;
  if (version === undefined || invictus?.updateCheckPerformed === true) return;
  invictus.updateCheckPerformed = true;
  fetch(versionUrl)
    .then(response => response.text())
    .then(versionText => {
      if (versionText.indexOf(version) === -1) {
        const updateNotification = document.createElement('div');
        updateNotification.classList.add('fixed-bottom', 'invictus-update-notification');
        /** @security safe innerHTML usage - static string */
        updateNotification.innerHTML = '<a id="invictus-update-link" href="#">A new version of invictus is available!</a>';
        document.body.appendChild(updateNotifier);
      }
    })
    .catch(error => {
      console.error('An error occured that prevented Invictus from checking for updates: %o', error);
      invictus.updateCheckPerformed = false;
    });
}
