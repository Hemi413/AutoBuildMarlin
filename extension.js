/**
 * Auto Build Marlin
 * extension.js
 *
 * NOTES: For 'command failed' check declarations!
 *        Be sure to escape backslashes in "new Regex()"
 *
 * TODO: Standardize startup sequence. Currently this extension intializes before the
 *       action bar icon is selected to reveal empty list-views with button icons,
 *       so the Welcome View can be given the correct state for the open workspace.
 *
 *       Opening a new folder or a new workspace actually reloads the whole window and
 *       starts the extension over from the top. So, there is no need to monitor the
 *       state of the currently open workspace if there's simply no folder open at all.
 *       The state of the Welcome View will be set correctly on the next startup.
 *
 *       That said, if a folder is open in the workspace, it may be watched to see if
 *       the content changes so that it becomes a valid Marlin installation, as might
 *       often occur when using Git externally.
 */

'use strict';

const vscode = require('vscode'),
         abm = require('./abm/abm'),
          vc = vscode.commands;

exports.activate = (context) => {

  const cs = context.subscriptions;

  cs.push(vc.registerCommand('abm.build',     () => { abm.run_command('build');     }));
  cs.push(vc.registerCommand('abm.upload',    () => { abm.run_command('upload');    }));
  cs.push(vc.registerCommand('abm.traceback', () => { abm.run_command('traceback'); }));
  cs.push(vc.registerCommand('abm.clean',     () => { abm.run_command('clean');     }));
  cs.push(vc.registerCommand('abm.config',    () => { abm.run_command('config');    }));
  cs.push(vc.registerCommand('abm.show',      () => { abm.run_command();            }));
  cs.push(vc.registerCommand('abm.sponsor',   () => { abm.sponsor();                }));

  abm.init(context, vscode);
  abm.validate();
  abm.watchAndValidate();
  abm.set_context('active', true);

  if (abm.show_on_startup()) setTimeout(abm.run_command, 1000);
};

exports.deactivate = () => { abm.set_context('active', false); };

//
// Extend String, Number, and Date with extras
//
String.prototype.lpad = function(len, chr) {
  if (chr === undefined) { chr = '&nbsp;'; }
  var s = this+'', need = len - s.length;
  if (need > 0) { s = new Array(need+1).join(chr) + s; }
  return s;
};

String.prototype.dequote = function()        { return this.replace(/^\s*"|"\s*$/g, '').replace(/\\/g, ''); };
String.prototype.prePad = function(len, chr) { return len ? this.lpad(len, chr) : this; };
String.prototype.zeroPad = function(len)     { return this.prePad(len, '0'); };
String.prototype.toHTML = function()         { return jQuery('<div>').text(this).html(); };
String.prototype.regEsc = function()         { return this.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&"); }
String.prototype.lineCount = function(ind)   { var len = (ind === undefined ? this : this.substr(0,ind*1)).split(/\r?\n|\r/).length; return len > 0 ? len - 1 : 0; };
String.prototype.lines = function()          { return this.split(/\r?\n|\r/); };
String.prototype.line = function(num)        { var arr = this.split(/\r?\n|\r/); return num < arr.length ? arr[1*num] : ''; };
String.prototype.replaceLine = function(num,txt) { var arr = this.split(/\r?\n|\r/); if (num < arr.length) { arr[num] = txt; return arr.join('\n'); } else return this; }
String.prototype.toLabel = function()        { return this.replace(/[\[\]]/g, '').replace(/_/g, ' ').toTitleCase(); }
String.prototype.toTitleCase = function()    { return this.replace(/([A-Z])(\w+)/gi, function(m,p1,p2) { return p1.toUpperCase() + p2.toLowerCase(); }); }
Number.prototype.limit = function(m1, m2)  {
  if (m2 == null) return this > m1 ? m1 : this;
  return this < m1 ? m1 : this > m2 ? m2 : this;
};
Date.prototype.fileStamp = function(filename) {
  var fs = this.getFullYear()
    + ((this.getMonth()+1)+'').zeroPad(2)
    + (this.getDate()+'').zeroPad(2)
    + (this.getHours()+'').zeroPad(2)
    + (this.getMinutes()+'').zeroPad(2)
    + (this.getSeconds()+'').zeroPad(2);

  if (filename !== undefined)
    return filename.replace(/^(.+)(\.\w+)$/g, '$1-['+fs+']$2');

  return fs;
}
