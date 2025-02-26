export default function Input({label, id, erro, ...props}){

    const estiloErro = "appearance-none block w-full px-3 py-2 border border-red-400 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    const estiloPadrao = "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"

    return (
      <div className="mt-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input id={id} className={erro ? estiloErro : estiloPadrao} {...props} /> 
      </div>
    )
  }