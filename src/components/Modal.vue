<template>
    <div class="modal flex">
        <div class="modal-content">
            <p>
                Are you sure you want to exit? 
                (Your changes will not be saved.)
            </p>
            <div class="actions flex">
                <button @click="closeModal" class="purple">Return</button>
                <button @click="closeInvoice" class="red">Close</button>
            </div>
        </div>
  </div>
</template>

<script>

    import { useStore } from 'vuex'
    export default {
        name: 'Modal',
        setup() {
            const store = useStore()

            //Close Modal
            const closeModal = () => {
                store.dispatch('toggleModal')
            }

            // Close invoice
            const closeInvoice = () => {
                store.dispatch('toggleInvoice')
                store.dispatch('toggleModal')
            }

            return{
                store,
                closeModal,
                closeInvoice,
            }
        }
    }

</script>

<style scoped>
    .modal{
        z-index: 100;
        position: fixed;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100%;
    }

    .modal-content{
        border-radius: 20px;
        padding: 48px 32px;
        max-width: 450px;
        background-color: #252945;
        color: white;
    }

    p {
        text-align: center;
    }

    .actions {
        margin-top: 24px;
    }

    button {
        flex: 1;
    }
</style>