import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import path from 'src/constants/path'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, generateURLNameAndId } from 'src/utils/FuncFormat'
interface Props {
  product: ProductType
}
export default function ProductItems({ product }: Props) {
  return (
    <Link to={`${path.home}${generateURLNameAndId({ name: product.name, id: product._id })}`}>
      <div className='rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.4rem] hover:shadow-md'>
        <div className='relative w-full pt-[100%]'>
          <img
            src={product.image}
            alt={product.name}
            className='absolute left-0 top-0 h-full w-full bg-white object-cover'
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='line-clamp-2 min-h-[2rem] text-xs'>{product.name}</div>
          <div className='mt-3 flex flex-wrap items-center justify-end text-[8px] md:text-xs lg:text-xs'>
            <div className=' text-gray-500 line-through'>
              <span className='text-xs'>₫</span>
              <span className='text-xs'>{formatCurrency(product.price_before_discount)}</span>
            </div>
            <div className='ml-1 text-orange'>
              <span className='text-xs'>₫</span>
              <span className='text-xs'>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-end'>
            <ProductRating rating={product.rating} />
            <div className='ml-2 text-xs'>
              <span>{formatNumberToSocialStyle(product.sold)}</span>
              <span className='ml-1'>Đã bán</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}