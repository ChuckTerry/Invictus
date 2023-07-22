/** 
 * This adds an Invictus link to the top nav bar when in edit mode
 * Link is made active elsewhere if needed.
 */
(() => {
  window.addEventListener('load', async () => {
    const notInEditMode = !document.querySelector('#usernavigation input[name=setmode]')?.checked;
    const topLinkAlreadyExists = document.querySelector('.invictus-nav-top') !== null;
    /* If we're not in edit mode or the nav link already exists, do nothing  */
    if (notInEditMode || topLinkAlreadyExists !== null) {
      return;
    }

    const elementOuterHtml = '<li class="nav-item nav-link invictus-nav-top" role="menuitem" data-key="flashcards" data-forceintomoremenu="false" tabindex="-1">Invictus<a></a></li>';
    const element = document.createElement('li');
    const parent = document.querySelector('.primary-navigation > nav > ul');
    const firstHiddenLi = parent.querySelector('.d-none');
    parent.insertBefore(element, firstHiddenLi);
    /** @security outerHTML is safe in context because it is a static string */
    element.outerHTML = elementOuterHtml;
  });
})();
