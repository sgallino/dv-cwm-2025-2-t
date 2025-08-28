<script>
export default {
    name: 'AppNavbar',
}
</script>

<template>
    <!-- 
    # Formato de los nombres de clases en Tailwind 
    Hay 2 formatos de nombres de clases con los que nos podemos topar:
    1. <estilo>-<valor>
        Por ejemplo:
            .p-4                            padding: 1rem;
            .bg-slate-200                   background-color: #e2e8f0;
            .text-center                    text-align: center;
    
    La mayoría de las clases de Tailwind siguen este formato.

    2. <valor>
        Este formato se suele sobretodo para estilos cuyos valores son únicos.
        Es decir, no se ven repetidos en otros estilos.
        También, en algunos casos, se usa para abreviaturas de estilos que 
        tienen múltiples valores.
        Por ejemplo:
            .flex                           display: flex;
            .grid                           display: grid;
            .underline                      text-decoration: underline;
    -->
    <nav class="flex items-center gap-8 p-4 bg-slate-200">
        <RouterLink class="text-xl" to="/">DV Social</RouterLink>
        <ul class="flex gap-4">
            <li>
                <RouterLink to="/">Home</RouterLink>
            </li>
            <li>
                <RouterLink to="/chat">Chat general</RouterLink>
            </li>
            <li>
                <RouterLink to="/ingresar">Ingresar</RouterLink>
            </li>
            <li>
                <RouterLink to="/crear-cuenta">Crear cuenta</RouterLink>
            </li>
        </ul>
    </nav>
</template>