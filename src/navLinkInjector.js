/** 
 * This adds an Invictus link to the top nav bar when in edit mode
 * Link is made active elsewhere if needed.
 */
(() => {
  window.addEventListener('load', async () => {
    /* If we're not in edit mode, do nothing  */
    if (!document.querySelector('#usernavigation input[name=setmode]').checked) {
      return;
    }

    const navMenuElement = document.createElement('li');
    navMenuElement.classList.add('nav-item');
    navMenuElement.setAttribute('role', 'none');
    navMenuElement.setAttribute('data-key', 'flashcards');
    navMenuElement.setAttribute('data-forceintomoremenu', 'false');

    const navMenuLink = document.createElement('a');
    navMenuElement.classList.add('nav-link', 'invictus-nav-top');
    navMenuElement.setAttribute('role', 'menuitem');
    navMenuElement.setAttribute('tabindex', '-1');
    navMenuElement.href = '#';
    navMenuElement.innerText = 'Invictus';

    navMenuElement.appendChild(navMenuLink);

    const navParentUl = document.querySelector('.primary-navigation > nav > ul');
    const firstHiddenLi = navParentUl.querySelector('.d-none');
    navParentUl.insertBefore(navMenuElement, firstHiddenLi);
  });
})();
