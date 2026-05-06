<template>
  <footer class="footer">
    <div class="page footer-inner">
      <span>© 2026 Bulonka Studio &nbsp;·&nbsp; <a href="/privacy/">Privacy</a></span>
      <span class="signoff">Made with care in Ukraine</span>
      <span><a href="mailto:contact@bulonka-studio.com">contact@bulonka-studio.com</a></span>
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
.signoff { font-style: italic; color: var(--on-surface-soft); }
.signoff::before { content: "— "; color: var(--accent-ochre); }
</style>
