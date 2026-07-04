export default function ManageSettings() {
  return (
    <div className='flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in zoom-in duration-500'>
      <div className='w-24 h-24 bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-500/20'>
        <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M12 2v20'/><path d='M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'/></svg>
      </div>
      <h1 className='text-3xl font-bold text-white mb-2'>Manage Settings</h1>
      <p className='text-gray-400 max-w-md'>The Settings management module is currently being provisioned. Check back soon for the full feature release.</p>
    </div>
  );
}