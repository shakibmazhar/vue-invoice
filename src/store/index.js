import { createStore } from "vuex";
import db from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default createStore({
    state: {
        invoiceData: [],
        invoiceModal: false,
        modalActive: false,
        invoicesLoaded: false,
    },
    mutations: {
        TOGGLE_INVOICE(state) {
            state.invoiceModal = !state.invoiceModal;
        },
        TOGGLE_MODAL(state) {
            state.modalActive = !state.modalActive;
        },
        SET_INVOICE_DATA(state, payload) {
            state.invoiceData.push(payload);
        },
        INVOICES_LOADED(state) {
            state.invoicesLoaded = true;
        },
    },
    actions: {
        toggleInvoice(context) {
            context.commit("TOGGLE_INVOICE");
        },
        toggleModal(context) {
            context.commit("TOGGLE_MODAL");
        },
        async getInvoices(context) {
            const docRef = collection(db, "invoices");
            const docSnap = await getDocs(docRef);
            docSnap.forEach((doc) => {
                if (
                    !context.state.invoiceData.some(
                        (invoice) => invoice.docID === doc.id
                    )
                ) {
                    const data = {
                        docID: doc.id,
                        invoiceId: doc.data().invoiceId,
                        billerStreetAddress: doc.data().billerStreetAddress,
                        billerCity: doc.data().billerCity,
                        billerZipCode: doc.data().billerZipCode,
                        billerCountry: doc.data().billerCountry,
                        clientName: doc.data().clientName,
                        clientEmail: doc.data().clientEmail,
                        clientStreetAddress: doc.data().clientStreetAddress,
                        clientCity: doc.data().clientCity,
                        clientZipCode: doc.data().clientZipCode,
                        clientCountry: doc.data().clientCountry,
                        invoiceDateUnix: doc.data().invoiceDateUnix,
                        invoiceDate: doc.data().invoiceDate,
                        paymentTerms: doc.data().paymentTerms,
                        paymentDueDateUnix: doc.data().paymentDueDateUnix,
                        paymentDueDate: doc.data().paymentDueDate,
                        productDescription: doc.data().productDescription,
                        invoicePending: doc.data().invoicePending,
                        invoiceDraft: doc.data().invoiceDraft,
                        invoiceItemList: doc.data().invoiceItemList,
                        invoiceTotal: doc.data().invoiceTotal,
                        invoicePaid: doc.data().invoicePaid,
                    };
                    context.commit("SET_INVOICE_DATA", data);
                }
            });
            context.commit("INVOICES_LOADED");
        },
    },
    modules: {},
});
