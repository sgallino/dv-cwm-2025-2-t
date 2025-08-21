<script>
export default {
    name: 'AppNavbar',
}
</script>

<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">DV Social</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Mostrar u ocultar menú de navegación">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/">Home</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/chat">Chat general</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/ingresar">Ingresar</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/crear-cuenta">Crear cuenta</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>