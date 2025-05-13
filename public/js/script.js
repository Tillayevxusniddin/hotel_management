document.addEventListener('DOMContentLoaded', () => {
    // O‘chirish tugmasi uchun tasdiqlash oynasi qo‘shish
    const tableBody = document.querySelector('tbody');
    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-button')) {
                if (confirm("Ushbu yozuvni o‘chirishni xohlaysizmi?")) {
                    const form = e.target.closest('form');
                    if (form) form.submit();
                }
            }
        });
    }

    // Kelajakda qo‘shimcha funksiyalar qo‘shish uchun joy
    // Masalan, forma yuborishdan oldin qo‘shimcha validatsiya yoki filtrlar
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            // Agar qo‘shimcha validatsiya kerak bo‘lsa, bu yerga qo‘shiladi
            // Hozircha faqat forma yuborilishini tasdiqlaymiz
            const isCreateOrEditForm = form.action.includes('/create') || form.action.includes('/update');
            if (isCreateOrEditForm && !confirm("Ma'lumotlarni saqlashni xohlaysizmi?")) {
                e.preventDefault();
            }
        });
    });
});