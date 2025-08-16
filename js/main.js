@@ .. @@
 /**
  * Função principal que inicializa a aplicação.
  */
 function initializeApp() {
+    // Initialize Lucide icons first
+    if (typeof lucide !== 'undefined') {
+        lucide.createIcons();
+    }
+    
     // Inicializa componentes de UI
     initializeTheme();
     setupMobileNav();
 
+    // Add enhanced loading states
+    addLoadingStates();
+
     // Configura os event listeners globais
     document.getElementById('login-form').addEventListener('submit', handleLogin);
     document.querySelectorAll('.tab-button, .mobile-tab-button').forEach(button => {
         button.addEventListener('click', () => switchTab(button.dataset.tab));
     });
 
     // Listeners dos modais
     document.getElementById('cancel-edit-appointment').addEventListener('click', closeEditModal);
     document.getElementById('edit-appointment-form').addEventListener('submit', handleSaveAppointment);
     document.getElementById('cancel-delete').addEventListener('click', closeDeleteModal);
     document.getElementById('confirm-delete').addEventListener('click', handleConfirmDelete);
 
+    // Add enhanced interactions
+    addEnhancedInteractions();
+
     // Inicia na primeira aba
     switchTab('overview');
 }
 
+/**
+ * Adds enhanced loading states and micro-interactions
+ */
+function addLoadingStates() {
+    // Add loading shimmer to cards while data loads
+    const cards = document.querySelectorAll('.bg-card');
+    cards.forEach(card => {
+        card.addEventListener('mouseenter', () => {
+            card.style.transform = 'translateY(-4px)';
+        });
+        card.addEventListener('mouseleave', () => {
+            card.style.transform = 'translateY(0)';
+        });
+    });
+}
+
+/**
+ * Adds enhanced interactions and animations
+ */
+function addEnhancedInteractions() {
+    // Add ripple effect to buttons
+    document.querySelectorAll('button').forEach(button => {
+        button.addEventListener('click', function(e) {
+            const ripple = document.createElement('span');
+            const rect = this.getBoundingClientRect();
+            const size = Math.max(rect.width, rect.height);
+            const x = e.clientX - rect.left - size / 2;
+            const y = e.clientY - rect.top - size / 2;
+            
+            ripple.style.width = ripple.style.height = size + 'px';
+            ripple.style.left = x + 'px';
+            ripple.style.top = y + 'px';
+            ripple.classList.add('ripple');
+            
+            this.appendChild(ripple);
+            
+            setTimeout(() => {
+                ripple.remove();
+            }, 600);
+        });
+    });
+
+    // Enhanced form validation feedback
+    document.querySelectorAll('input').forEach(input => {
+        input.addEventListener('invalid', function() {
+            this.classList.add('error');
+            setTimeout(() => {
+                this.classList.remove('error');
+            }, 3000);
+        });
+    });
+}
+
 // Ponto de partida: espera o DOM carregar para iniciar.
 document.addEventListener('DOMContentLoaded', initializeApp);