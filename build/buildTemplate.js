import { buildGlobalObject } from '../src/buildGlobalObject';

(() => {
  
  {{{class_FlashCard}}}
  {{{class_FlashCardSet}}}

  {{{function_nonDestructiveAssign}}}
  {{{function_uuidGenerator}}}
  {{{function_navLinkInjector}}}
  {{{function_updateNotifier}}}
  
  {{{function_buildGlobalObject}}}
  
  buildGlobalObject();
  
  if (document.querySelector('#invictus-stylesheet') === null) {
    const stylesheet = document.createElement('style');
    stylesheet.innerText = `{{{css_styles}}}`;
    stylesheet.id = 'invictus-stylesheet';
    document.head.appendChild(stylesheet);
  }
})();


















