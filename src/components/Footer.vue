<template>
  <footer class="footer">
    <div class="page footer-inner">
      <span>© Bulonka Studio</span>
      <a href="/privacy/">Privacy</a>
      <span class="muted">yholiakh [at] gmail.com</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--outline);
  margin-top: var(--sp-8);
}
.footer-inner {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  padding-top: var(--sp-4);
  padding-bottom: var(--sp-4);
  font-size: 0.78rem;
  color: var(--on-surface-muted);
}
.footer a { color: var(--on-surface-muted); border-bottom: 1px solid transparent; }
.footer a:hover { color: var(--on-surface); border-bottom-color: var(--outline); }
.muted { color: var(--on-surface-muted); }
</style>
