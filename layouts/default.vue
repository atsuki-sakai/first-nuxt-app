<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto max-w-2xl py-8 px-4">
      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Todo App</h1>
        <p class="text-gray-600">Nuxt.js + Vue 3 + TypeScript</p>
        <nav class="mt-4 flex justify-center gap-4">
          <NuxtLink to="/" class="text-blue-500 hover:text-blue-700">ホーム</NuxtLink>
          <NuxtLink to="/todos" class="text-blue-500 hover:text-blue-700">Todo一覧</NuxtLink>
        </nav>
      </header>
      
      <main>
        <NuxtPage />
      </main>
      
      <footer class="mt-12 text-center text-gray-500 text-sm">
        <p>© 2025 Todo App</p>
      </footer>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>