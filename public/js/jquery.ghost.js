$.ghost = function(element, label, options) {
  if (typeof options == 'undefined') options = {};
  var originalColor = $(element).css('color'),
    originalStyle = $(element).css('font-style');
  label = $(element).attr('placeholder') || label;
  
  function ghostify(element) {
    if (touched(element)) return false;
    $(element)
      .css('color',       (options.color || '#ccc'))
      .val(label)
  }
  
  function deghostify(element) {
    if ($(element).val() != label) return false;
    $(element)
      .css('color', originalColor)
      .css('font-style', originalStyle)
      .val('')
  }
  
  function touched(element) {
    return ($(element).val() != '' && $(element).val() != label);
  }
  
  $(element).focus(function()  { deghostify(this); });
  $(element).blur(function()   { ghostify(this); });
  $(element).parents('form').submit(function() { if (!touched(element)) deghostify(element); });
  ghostify(element);
}

$.fn.ghost = function(label, options) { return this.each(function() { $.ghost(this, label, options); }); }