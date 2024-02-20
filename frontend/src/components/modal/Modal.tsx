import "./Modal.css";

function Modal() {
    return (
        <>
            <dialog id="fridayModal">
                <h2 id="fridayModalTitle">modal title</h2>
                <p id="fridayModalContent">modal content...</p>
                <button id="closeBtn">close</button>
            </dialog>
            <button id="openBtn">open modal</button>
        </>
    );
}

export default Modal;
