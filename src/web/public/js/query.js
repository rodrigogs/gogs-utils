$(document).ready(() => {
  const $query = $('[name="query"]');

  const editor = ace.edit('query-editor');
  const MySQLMode = ace.require('ace/mode/mysql').Mode;

  editor.setAutoScrollEditorIntoView();
  editor.setTheme('ace/theme/monokai');
  editor.session.setMode(new MySQLMode());
  editor.setHighlightActiveLine(true);
  editor.setOptions({
    maxLines: 30,
    wrap: true,
    autoScrollEditorIntoView: true,
    enableBasicAutocompletion: true,
  });

  document.getElementById('query-editor').style.fontSize='16px';

  editor.session.on('change', () => {
    $query.val(editor.session.getValue());
  });
});
