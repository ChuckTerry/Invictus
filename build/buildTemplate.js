(() => {
  {{{function_nonDestructiveAssign}}}
  {{{function_uuidGenerator}}}
  {{{function_navLinkInjector}}}
  {{{function_updateNotifier}}}
  
  {{{function_buildGlobalObject}}}
  
  {{{class_FlashCard}}}
  {{{class_FlashCardSet}}}
  
  if (document.querySelector('#invictus-stylesheet') === null) {
    const stylesheet = document.createElement('style');
    stylesheet.innerText = `{{{css_styles}}}`;
    stylesheet.id = 'invictus-stylesheet';
    document.head.appendChild(stylesheet);
  }
})();


















