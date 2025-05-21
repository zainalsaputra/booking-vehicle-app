import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import {
  Card, CardHeader, CardBody, Typography, Button, Chip, Input,
} from "@material-tailwind/react";

export function Laporan() {
  const [pengajuanData, setPengajuanData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(""); // tanggal awal dari user
  const [endDate, setEndDate] = useState("");     // tanggal akhir dari user
  const itemsPerPage = 10;


  const handleExportExcel = () => {
    if (!pengajuanData || pengajuanData.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    const exportData = pengajuanData.map((item, index) => ({
      No: index + 1,
      Kantor: item.nama_kantor,
      Wilayah: item.wilayah_kantor,
      Kendaraan: item.nama_kendaraan,
      Plat: item.nomor_plat,
      Jenis: item.jenis_kendaraan,
      Kepemilikan: item.kepemilikan,
      Supir: item.nama_pengemudi,
      Telepon: item.telepon_pengemudi,
      Tujuan: item.tujuan,
      Tanggal_Mulai: item.tanggal_mulai,
      Tanggal_Selesai: item.tanggal_selesai,
      Status: item.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Laporan_Pengajuan_${startDate}_to_${endDate}.xlsx`);
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Token tidak ditemukan!");
        return;
      }

      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        console.error("Token sudah expired! Silakan login kembali.");
        return;
      }

      if (!startDate || !endDate) {
        console.warn("Tanggal belum lengkap.");
        return;
      }

      const response = await axios.get("http://localhost:8000/api/vehicle-report", {
        params: {
          start_date: `${startDate} 00:00:00`,
          end_date: `${endDate} 23:59:59`,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setPengajuanData(response.data);
      setCurrentPage(1); // reset halaman ke-1 saat filter baru
    } catch (error) {
      console.error("Gagal memuat data pengajuan:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pengajuanData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pengajuanData.length / itemsPerPage);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6">
          <div className="flex justify-between items-center w-full">
            <Typography variant="h6" color="white">Laporan Periodik</Typography>
          </div>
        </CardHeader>

        <div className="flex flex-wrap gap-4 px-6 mb-4">
          <Input
            label="Tanggal Mulai"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="max-w-xs"
          />
          <Input
            label="Tanggal Selesai"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={fetchReports} className="bg-blue-600 text-white px-5 py-2">Tampilkan Laporan</Button>

          {pengajuanData.length > 0 && (
            <Button onClick={handleExportExcel} className="bg-green-600 text-white px-5 py-2">
              Export ke Excel
            </Button>
          )}
        </div>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["No", "Kantor", "Kendaraan", "Spesifikasi", "Supir", "Tujuan", "Status"].map((el) => (
                  <th key={el} className="border-b py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.id}>
                  <td className="py-3 px-5">{indexOfFirstItem + index + 1}</td>

                  <td className="py-3 px-5">
                    <Typography className="text-sm font-semibold text-blue-gray-600">{item.nama_kantor}</Typography>
                    <Typography className="text-xs font-normal text-blue-gray-500">{item.wilayah_kantor}</Typography>
                  </td>

                  <td className="py-3 px-5">
                    <Typography className="text-sm font-semibold text-blue-gray-600">{item.nama_kendaraan}</Typography>
                    <Typography className="text-xs font-normal text-blue-gray-500">{item.nomor_plat}</Typography>
                  </td>

                  <td className="py-3 px-5">
                    <Typography className="text-sm font-semibold text-blue-gray-600">{item.jenis_kendaraan}</Typography>
                    <Typography className="text-xs font-normal text-blue-gray-500">{item.kepemilikan}</Typography>
                  </td>

                  <td className="py-3 px-5">
                    <Typography className="text-sm font-semibold text-blue-gray-600">{item.nama_pengemudi}</Typography>
                    <Typography className="text-xs font-normal text-blue-gray-500">{item.telepon_pengemudi}</Typography>
                  </td>

                  <td className="py-3 px-5">
                    <Typography className="text-sm text-blue-gray-600">{item.tujuan}</Typography>
                    <Typography className="text-xs text-blue-gray-500">
                      {new Date(item.tanggal_mulai).toLocaleDateString()} - {new Date(item.tanggal_selesai).toLocaleDateString()}
                    </Typography>
                  </td>

                  <td className="py-3 px-5">
                    <Chip
                      variant="gradient"
                      color={item.status === "pending" ? "amber" : item.status === "approved" ? "green" : "red"}
                      value={item.status}
                      className="py-0.5 px-2 text-[11px] font-medium w-fit"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex items-center justify-center gap-4 p-3 mt-4 border rounded-lg">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Sebelumnya
            </Button>

            <span className="text-sm font-medium text-gray-700">
              Halaman <span className="font-semibold">{currentPage}</span> dari <span className="font-semibold">{totalPages}</span>
            </span>

            <Button
              variant="outlined"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Berikutnya
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
