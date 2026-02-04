
import sys, io, os

BT = chr(96)  # backtick

file_content = f'''/**
 * Wally \u2013 Link / Add Account
 *
 * 5-step simulated account-linking flow:
 *   type \u2192 bank \u2192 auth \u2192 connecting \u2192 success
 */

import React, {{ useState, useEffect }} from 'react';
import {{ useApp }}                      from '../../AppContext';
import * as Icons                      from '../shared/Icons';

const SF        = 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif';
const SF_DISPLAY= 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif';

// \u2500\u2500\u2500 Spinner CSS (injected once) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const SPIN_CSS = {BT}
@keyframes wallySpinLink {{
  to {{ transform: rotate(360deg); }}
}}
{BT};
function injectSpinCSS() {{
  if (document.getElementById('wally-spin-link-css')) return;
  const tag = document.createElement('style');
  tag.id          = 'wally-spin-link-css';
  tag.textContent = SPIN_CSS;
  document.head.appendChild(tag);
}}
'''

print(file_content[:200])
print("OK - first section works")
