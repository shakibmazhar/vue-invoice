<template>
  <div @click="checkClick" ref="invoiceWrap" class="invoice-wrap flex flex-column">
    <form @submit.prevent="submitForm" class="invoice-content">
        <Loading v-if="state.invoiceUploading" />
        <h1>New Invoice</h1>

        <!-- Bill From -->
        <div class="bill-from flex flex-column">
            <h4 class="section-title">Bill From</h4>
            <div class="input flex flex-column">
                <label for="billerStreetAddress">Street Address</label>
                <input required type="text" id="billerStreetAddress" v-model="state.billerStreetAddress" />
            </div>
            <div class="location-details flex">
                <div class="input flex flex-column">
                    <label for="billerCity">City</label>
                    <input required type="text" id="billerCity" v-model="state.billerCity" />
                </div>
                <div class="input flex flex-column">
                    <label for="billerZipCode">Zip Code</label>
                    <input required type="text" id="billerZipCode" v-model="state.billerZipCode" />
                </div>
                <div class="input flex flex-column">
                    <label for="billerCountry">Country</label>
                    <input required type="text" id="billerCountry" v-model="state.billerCountry" />
                </div>
            </div>
        </div>

        <!-- Bill To -->
        <div class="bill-to flex flex-column">
            <h4 class="section-title">Bill To</h4>
            <div class="input flex flex-column">
                <label for="clientName">Client's Name</label>
                <input required type="text" id="clientName" v-model="state.clientName" />
            </div>
            <div class="input flex flex-column">
                <label for="clientEmail">Client's E-mail</label>
                <input required type="text" id="clientEmail" v-model="state.clientEmail" />
            </div>
            <div class="input flex flex-column">
                <label for="clientStreetAddress">Client's Street Address</label>
                <input required type="text" id="clientStreetAddress" v-model="state.clientStreetAddress" />
            </div>
            <div class="location-details flex">
                <div class="input flex flex-column">
                    <label for="clientCity">City</label>
                    <input required type="text" id="clientCity" v-model="state.clientCity" />
                </div>
                <div class="input flex flex-column">
                    <label for="clientZipCode">Zip Code</label>
                    <input required type="text" id="clientZipCode" v-model="state.clientZipCode" />
                </div>
                <div class="input flex flex-column">
                    <label for="clientCountry">Country</label>
                    <input required type="text" id="clientCountry" v-model="state.clientCountry" />
                </div>
            </div>
        </div>

        <!-- Invoice Work Details -->
        <div class="invoice-work flex flex-column">
            <div class="payment flex">
                <div class="input flex flex-column">
                    <label for="invoiceDate">Invoice Date</label>
                    <input disabled type="text" id="invoiceDate" v-model="state.invoiceDate" />
                </div>
                <div class="input flex flex-column">
                    <label for="paymentDueDate">Payment Due</label>
                    <input disabled type="text" id="paymentDueDate" v-model="state.paymentDueDate" />
                </div>
            </div>
            <div class="input flex flex-column">
                    <label for="paymentTerms">Payment Terms</label>
                    <select required id="paymentTerms" v-model="state.paymentTerms">
                        <option value="30">Net 30 Days</option>
                        <option value="60">Net 60 Days</option>
                    </select>
            </div>
            <div class="input flex flex-column">
                    <label for="productDescription">Product Description</label>
                    <input required type="text" id="productDescription" v-model="state.productDescription" />
            </div>
            <div class="work-items">
                <h3>Item List</h3>
                <table v-if="state.invoiceItemList.length > 0" class="item-list">
                    <tr class="table-heading flex">
                        <th class="item-name">Item Name</th>
                        <th class="qty">Qty</th>
                        <th class="price">Price</th>
                        <th class="total">Total</th>
                    </tr>
                    <tr class="table-items flex" v-for="(item, index) in state.invoiceItemList" :key="index">
                        <td class="item-name"><input v-model="item.itemName" type="text"></td>
                        <td class="qty"><input v-model="item.qty" type="text"></td>
                        <td class="price"><input v-model="item.price" type="text"></td>
                        <td class="total flex">${{item.total = item.price*item.qty}}</td>
                        <img @click="deleteInvoiceItem(item.id)" src="@/assets/icon-delete.svg" alt="" />
                    </tr>
                </table>
                <div @click="addNewInvoiceItem" class="flex button">
                    <img src="@/assets/icon-plus.svg" alt="">
                    Add New Item 
                </div>
            </div>
        </div>

        <!-- Save or Exit -->
        <div class="save flex">
            <div class="left">
                <button type="button" @click="closeInvoice" class="red">Cancel</button>
            </div>
            <div class="right flex">
                <button type="submit" @click="saveDraft" class="dark-purple">Save Draft</button>
                <button type="submit" @click="publishInvoice" class="purple">Create Invoice</button>
            </div>
        </div>
    </form>
  </div>
</template>

<script>
    import { reactive, watch, ref } from 'vue';
    import { useStore } from 'vuex';
    import { uid } from 'uid';
    import db from "../firebase/firebase";
    import { collection, addDoc } from "firebase/firestore"; 
    import Loading from '../components/Loading.vue'
    export default {
        name: 'InvoceModal',
        components: {
            Loading,
        },
        setup() {
            const state = reactive({
                dateOptions: { year: 'numeric', month: 'short', day: 'numeric' },
                billerStreetAddress: null,
                billerCity: null,
                billerZipCode: null,
                billerCountry: null,
                clientName: null,
                clientEmail: null,
                clientStreetAddress: null,
                clientCity: null,
                clientZipCode: null,
                clientCountry: null,
                invoiceDateUnix: null,
                invoiceDate: null,
                paymentTerms: null,
                paymentDueDateUnix: null,
                paymentDueDate: null,
                productDescription: null,
                invoicePending: null,
                invoiceDraft: null,
                invoiceItemList: [],
                invoiceTotal: 0,
                invoiceUploading: false,
            }) 
            const setInvoiceDate = () => {
                state.invoiceDateUnix = Date.now()
                state.invoiceDate = new Date(state.invoiceDateUnix).toLocaleDateString('en-us', state.dateOptions)
            }
            setInvoiceDate()
            // Use Store
            const store = useStore()

            // Close invoice
            const closeInvoice = () => {
                store.dispatch('toggleInvoice')
            }

            // Add new invoice item
            const addNewInvoiceItem = () => {
                state.invoiceItemList.push({
                    id: uid(),
                    itemName: '',
                    qty: '',
                    price: 0,
                    total: 0
                })
            }

            // Delete invoice item
            const deleteInvoiceItem = (id) => {
                state.invoiceItemList = state.invoiceItemList.filter(item => item.id !== id)
            }

            // Calculate invoice total
            const calculateInvoiceTotal = () => {
                state.invoiceTotal = 0
                state.invoiceItemList.forEach((item) => {
                    state.invoiceTotal += item.total
                })
            }

            // Publish invoice
            const publishInvoice = () => {
                state.invoicePending = true
            }

            // Save draft
            const saveDraft = () => {
                state.saveDraft = true
            }
            
            // Upload invoice
            const uploadInvoice = async () => {
                if(state.invoiceItemList.length <= 0){
                    alert('Please ensure you have filled out work items!')
                }
                else{
                    calculateInvoiceTotal()
                    const data = {
                        invoiceId: uid(6),
                        billerStreetAddress: state.billerStreetAddress,
                        billerCity: state.billerCity,
                        billerZipCode: state.billerZipCode,
                        billerCountry: state.billerCountry,
                        clientName: state.clientName,
                        clientEmail: state.clientEmail,
                        clientStreetAddress: state.clientStreetAddress,
                        clientCity: state.clientCity,
                        clientZipCode: state.clientZipCode,
                        clientCountry: state.clientCountry,
                        invoiceDateUnix: state.invoiceDateUnix,
                        invoiceDate: state.invoiceDate,
                        paymentTerms: state.paymentTerms,
                        paymentDueDateUnix: state.paymentDueDateUnix,
                        paymentDueDate: state.paymentDueDate,
                        productDescription: state.productDescription,
                        invoicePending: state.invoicePending,
                        invoiceDraft: state.invoiceDraft,
                        invoiceItemList: state.invoiceItemList,
                        invoiceTotal: state.invoiceTotal,
                        invoicePaid: null,    
                    }
                    state.invoiceUploading = true
                    await addDoc(collection(db, 'invoices'), data).catch(error => console.log(error))
                    closeInvoice()
                    state.invoiceUploading = false
                }
            }

            // invoiceWrap ref
            const invoiceWrap = ref(null)

            // Check clicks outsilde invoice modal
            const checkClick = (e) => {
                if(e.target === invoiceWrap.value ){
                    store.dispatch('toggleModal')
                }
            }

            // Submit form
            const submitForm = () => {
                uploadInvoice()
            }

            // watch paymentTerms for changes to calculate due date
            watch(() => state.paymentTerms, () => {
                const futureDate = new Date()
                state.paymentDueDateUnix = futureDate.setDate(futureDate.getDate() + parseInt(state.paymentTerms))
                state.paymentDueDate = new Date(state.paymentDueDateUnix).toLocaleDateString('en-us', state.dateOptions)
            })

            return{
                state,
                closeInvoice,
                addNewInvoiceItem,
                deleteInvoiceItem,
                publishInvoice,
                saveDraft,
                submitForm,
                checkClick,
                invoiceWrap,
            }
        }
    }
</script>

<style scoped>
    .invoice-wrap{
        position: fixed;
        top: 0;
        left: 0;
        background-color: transparent;
        width: 100%;
        height: 100vh;
        overflow-y: scroll;
        overflow-x: hidden;
        scrollbar-width: none;
    }

    .invoice-wrap::-webkit-scrollbar{
        display: none;
    }

    .invoice-content{
        position: relative;
        padding: 56px;
        max-width: 700px;
        width: 100%;
        background-color: #141625;
        color: white;
        box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .invoice-content > h1{
        margin-bottom: 48px;
        color: white;
    }

    .work-items > h3{
        margin-bottom: 16px;
        font-size: 18px;
        color: #777f98;
    }

    .section-title{
        color: #7c5dfa;
        font-size: 16px;
        margin-bottom: 24px;
    }

    .bill-to, .bill-from{
        margin-bottom: 48px;
    }

    .payment{
        gap: 24px;
    }

    .location-details{
        gap: 16px;
    }

    .location-details > div {
        flex: 1;
    }

    .item-list{
        width: 100%;
    }

    .table-heading, .table-items{
        gap: 16px;
        font-size: 12px;
    }

    .item-name{
        flex-basis: 50%;
    }

    .qty{
        flex-basis: 10%;
    }

    .price{
        flex-basis: 20%;
    }

    .total{
        flex-basis: 20%;
        align-self: center;
    }

    .table-heading{
        margin-bottom: 16px;
    }

    .table-heading > th{
        text-align: left;
    }

    .table-items{
        position: relative;
        margin-bottom: 24px;
    }

    .table-items > img{
        position: absolute;
        top: 15px;
        right: 0;
        width: 12px;
        height: 16px;
    }

    .input{
        margin-bottom: 24px;
    }

    label{
        font-size: 12px;
        margin-bottom: 6px;
    }

    input, select{
        width: 100%;
        background-color: #1e2139;
        color: white;
        border-radius: 4px;
        padding: 12px 4px;
        border: none;
        outline: none;
    }

    .button{
        color: white;
        background-color: #252945;
        align-items: center;
        justify-content: center;
        width: 100%;
    }

    .button > img{
        margin-right: 4px;
    }

    .save{
        margin-top: 60px;
    }

    .save > div{
        flex: 1;
    }

    .right{
        justify-content: flex-end;
    }

    @media (min-width: 900px){
        .invoice-wrap{
            left: 90px;
        }
    }
</style>