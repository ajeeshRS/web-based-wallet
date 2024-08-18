export default function ShowQrCode({address:any}) {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="relative w-5/6 rounded-lg p-8 shadow-lg bg-[#1F2937] sm:w-2/3 md:w-1/3">
                <p>qr code</p>
            </div>
        </div>);
}