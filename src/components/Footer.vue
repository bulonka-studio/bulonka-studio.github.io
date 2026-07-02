<template>
  <footer class="footer">
    <svg class="grass" viewBox="0 0 1200 14" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g fill="none" stroke="var(--accent-sage)" stroke-width="1.5" stroke-linecap="round" opacity="0.65">
        <path d="M60 14 Q62 5 64 14 M68 14 Q70 8 72 14"/>
        <path d="M180 14 Q183 4 186 14 M190 14 Q192 8 194 14 M198 14 Q200 9 202 14"/>
        <path d="M420 14 Q422 6 424 14 M428 14 Q430 9 432 14"/>
        <path d="M600 14 Q603 4 606 14 M610 14 Q612 7 614 14"/>
        <path d="M800 14 Q802 6 804 14 M808 14 Q810 9 812 14 M816 14 Q818 7 820 14"/>
        <path d="M1000 14 Q1002 5 1004 14 M1008 14 Q1010 8 1012 14"/>
        <path d="M1130 14 Q1133 6 1136 14"/>
      </g>
    </svg>
    <div class="page footer-inner">
      <span>© 2026 Bulonka Studio &nbsp;·&nbsp; <a href="/privacy/">Privacy</a></span>
      <span class="signoff">Made with care in Ukraine</span>
      <span><a class="footer-mail" href="mailto:contact@bulonka-studio.com">contact@bulonka-studio.com</a></span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--outline);
  margin-top: var(--sp-8);
  padding-top: var(--sp-5);
  padding-bottom: var(--sp-7);
  position: relative;
  z-index: 1;
}
/* The ground the house stands on. */
.grass {
  position: absolute;
  top: -14px;
  left: 0;
  width: 100%;
  height: 14px;
  pointer-events: none;
}
.footer-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  font-size: 0.9rem;
  color: var(--on-surface-muted);
}
.footer a { color: var(--on-surface-muted); border-bottom: 1px solid transparent; }
.footer a:hover { color: var(--on-surface); border-bottom-color: var(--outline); }
.footer-mail { font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; font-size: 0.85rem; }
.signoff { font-style: italic; color: var(--on-surface-soft); }
.signoff::before { content: "— "; color: var(--accent-ochre); }
</style>
