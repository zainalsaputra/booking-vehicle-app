import { useState } from "react";
import { Listbox } from "@headlessui/react";

export default function FormPengajuan({ vehicles, offices, drivers, approvers }) {
    const [formData, setFormData] = useState({
        vehicle_id: null,
        office_id: null,
        driver_id: null,
        start_date: "",
        end_date: "",
        purpose: "",
        approver_ids: [],
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleApproverToggle = (id) => {
        setFormData((prev) => {
            const exists = prev.approver_ids.includes(id);
            return {
                ...prev,
                approver_ids: exists
                    ? prev.approver_ids.filter((a) => a !== id)
                    : [...prev.approver_ids, id],
            };
        });
    };

    return (
        <form className="space-y-4 p-4">
            {/* Vehicle Selection */}
            <div>
                <label className="block mb-1">Kendaraan</label>
                <Listbox value={formData.vehicle_id} onChange={(val) => handleChange("vehicle_id", val)}>
                    <Listbox.Button className="w-full border px-4 py-2 rounded text-left">
                        {vehicles.find((v) => v.id === formData.vehicle_id)?.name || "Pilih Kendaraan"}
                    </Listbox.Button>
                    <Listbox.Options className="border rounded mt-1 bg-white shadow max-h-60 overflow-y-auto">
                        {vehicles.map((vehicle) => (
                            <Listbox.Option key={vehicle.id} value={vehicle.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                {vehicle.name} - {vehicle.plate_number}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Listbox>
            </div>

            {/* Office Selection */}
            <div>
                <label className="block mb-1">Kantor</label>
                <Listbox value={formData.office_id} onChange={(val) => handleChange("office_id", val)}>
                    <Listbox.Button className="w-full border px-4 py-2 rounded text-left">
                        {offices.find((o) => o.id === formData.office_id)?.name || "Pilih Kantor"}
                    </Listbox.Button>
                    <Listbox.Options className="border rounded mt-1 bg-white shadow max-h-60 overflow-y-auto">
                        {offices.map((office) => (
                            <Listbox.Option key={office.id} value={office.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                {office.name} - {office.region}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Listbox>
            </div>

            {/* Driver Selection */}
            <div>
                <label className="block mb-1">Driver</label>
                <Listbox value={formData.driver_id} onChange={(val) => handleChange("driver_id", val)}>
                    <Listbox.Button className="w-full border px-4 py-2 rounded text-left">
                        {drivers.find((d) => d.id === formData.driver_id)?.name || "Pilih Driver"}
                    </Listbox.Button>
                    <Listbox.Options className="border rounded mt-1 bg-white shadow max-h-60 overflow-y-auto">
                        {drivers.map((driver) => (
                            <Listbox.Option key={driver.id} value={driver.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                {driver.name} - {driver.phone}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Listbox>
            </div>

            {/* Start and End Date */}
            <div>
                <label className="block mb-1">Tanggal Mulai</label>
                <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => handleChange("start_date", e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                />
            </div>
            <div>
                <label className="block mb-1">Tanggal Selesai</label>
                <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => handleChange("end_date", e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                />
            </div>

            {/* Purpose */}
            <div>
                <label className="block mb-1">Keperluan</label>
                <input
                    type="text"
                    value={formData.purpose}
                    onChange={(e) => handleChange("purpose", e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                />
            </div>

            {/* Approvers (multiple) */}
            <div>
                <label className="block mb-1">Approver</label>
                <div className="space-y-2">
                    {approvers.map((approver) => (
                        <label key={approver.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                value={approver.id}
                                checked={formData.approver_ids.includes(approver.id)}
                                onChange={() => handleApproverToggle(approver.id)}
                            />
                            {approver.name} ({approver.email})
                        </label>
                    ))}
                </div>
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Submit
            </button>
        </form>
    );
}
