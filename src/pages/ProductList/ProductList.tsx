import AsideFilter from './components/AsideFilter'
import ProductItems from './components/ProductItems'
import SortProductList from './components/SortProductList'
import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import Pagination from 'src/components/Pagination'
import { ProductConfig } from 'src/types/product.type'
import categoryApi from 'src/apis/category.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import SlideShow from 'src/components/SlideShow/SlideShow'
import io from 'socket.io-client'
import { useEffect } from 'react'

const socket = io('http://localhost:4000/')

export default function ProductList() {
  // ====================== gửi data lên api
  // loại bỏ những thuộc tính khi chạy cho ra undefined
  const queryConfig = useQueryConfig()
  // get All Products
  const { data: ProductsData, refetch } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductConfig)
    },
    // thuộc tính này giúp cho việc thay đổi chuyển trang k bị cập nhật lại rồi set lại data
    // mà nó sẽ giữ gtri cũ và cập nhật mới => tránh re-render
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })

  // Get All Categories
  const { data: Categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })
  useEffect(() => {
    socket.on('addedProduct', () => {
      refetch()
    })
    socket.on('updatedProduct', () => {
      refetch()
    })
    socket.on('deletedProduct', () => {
      refetch()
    })
    return () => {
      socket.off('addedProduct')
      socket.off('updatedProduct')
      socket.off('deletedProduct')
    }
  }, [])

  return (
    <div className='bg-gray-200 pb-5'>
      <div className='h-52 py-2 md:h-64 lg:h-[500px]'>
        <SlideShow autoplayDelay={2500} />
      </div>
      <div className='container pt-2'>
        {ProductsData && Categories && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter categories={Categories.data.data} queryConfig={queryConfig} />
            </div>
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={ProductsData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4 lg:gap-3 xl:grid-cols-5'>
                {ProductsData.data.data.products.map((items) => (
                  <div className='col-span-1' key={items._id}>
                    <ProductItems product={items} />
                  </div>
                ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={ProductsData.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
