import * as THREE from 'three'

export default class InformationSection
{
    constructor(_options)
    {
        // Options
        this.time = _options.time
        this.resources = _options.resources
        this.objects = _options.objects
        this.areas = _options.areas
        this.tiles = _options.tiles
        this.debug = _options.debug
        this.x = _options.x
        this.y = _options.y

        // Set up
        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false

        this.setStatic()
        this.setLinks()
        this.setActivities()
        this.setTiles()
    }

    setStatic()
    {
        this.objects.add({
            base: this.resources.items.informationStaticBase.scene,
            collision: this.resources.items.informationStaticCollision.scene,
            floorShadowTexture: this.resources.items.informationStaticFloorShadowTexture,
            offset: new THREE.Vector3(this.x, this.y, 0),
            mass: 0
        })
    }

    setLinks()
    {
        // Set up
        this.links = {}
        this.links.x = 1.95
        this.links.y = - 1.5
        this.links.halfExtents = {}
        this.links.halfExtents.x = 1
        this.links.halfExtents.y = 1
        this.links.distanceBetween = 2.4
        this.links.labelWidth = this.links.halfExtents.x * 2 + 1
        this.links.labelGeometry = new THREE.PlaneGeometry(this.links.labelWidth, this.links.labelWidth * 0.25, 1, 1)
        this.links.labelOffset = - 1.6
        this.links.items = []

        this.links.container = new THREE.Object3D()
        this.links.container.matrixAutoUpdate = false
        this.container.add(this.links.container)

        // Options
        this.links.options = [
            {
                href: 'https://twitter.com/shi_wenhan',
                labelTexture: this.resources.items.informationContactTwitterLabelTexture
            },
            {
                href: 'https://github.com/xibuka',
                labelTexture: this.resources.items.informationContactGithubLabelTexture
            },
            {
                href: 'https://www.linkedin.com/in/wenhan-shi-0883a9132/',
                labelTexture: this.resources.items.informationContactLinkedinLabelTexture
            },
            {
                href: 'mailto:shibunkan@gmail.com',
                labelTexture: this.resources.items.informationContactMailLabelTexture
            }
        ]

        // Create each link
        let i = 0
        for(const _option of this.links.options)
        {
            // Set up
            const item = {}
            item.x = this.x + this.links.x + this.links.distanceBetween * i
            item.y = this.y + this.links.y
            item.href = _option.href

            // Create area
            item.area = this.areas.add({
                position: new THREE.Vector2(item.x, item.y),
                halfExtents: new THREE.Vector2(this.links.halfExtents.x, this.links.halfExtents.y)
            })
            item.area.on('interact', () =>
            {
                window.open(_option.href, '_blank')
            })

            // Texture
            item.texture = _option.labelTexture
            item.texture.magFilter = THREE.NearestFilter
            item.texture.minFilter = THREE.LinearFilter

            // Create label
            item.labelMesh = new THREE.Mesh(this.links.labelGeometry, new THREE.MeshBasicMaterial({ wireframe: false, color: 0xffffff, alphaMap: _option.labelTexture, depthTest: true, depthWrite: false, transparent: true }))
            item.labelMesh.position.x = item.x + this.links.labelWidth * 0.5 - this.links.halfExtents.x
            item.labelMesh.position.y = item.y + this.links.labelOffset
            item.labelMesh.matrixAutoUpdate = false
            item.labelMesh.updateMatrix()
            this.links.container.add(item.labelMesh)

            // Save
            this.links.items.push(item)

            i++
        }
    }

    setActivities()
    {
        // Set up
        this.activities = {}
        this.activities.x = this.x + 0
        this.activities.y = this.y - 10
        this.activities.multiplier = 5.5

        // Geometry
        this.activities.geometry = new THREE.PlaneGeometry(2 * this.activities.multiplier, 1 * this.activities.multiplier, 1, 1)

        // Build the personal introduction and writing topics as a texture.
        // The source blog identifies Wenhan Shi and publishes technical posts
        // about Kong/API gateways, cloud, DevOps, Python, and automation.
        this.activities.canvas = document.createElement('canvas')
        this.activities.canvas.width = 1200
        this.activities.canvas.height = 600
        this.activities.context = this.activities.canvas.getContext('2d')
        this.activities.context.fillStyle = '#000000'
        this.activities.context.fillRect(0, 0, this.activities.canvas.width, this.activities.canvas.height)
        this.activities.context.fillStyle = '#ffffff'
        this.activities.context.textBaseline = 'top'
        this.activities.context.font = '900 78px "Arial Narrow", Arial, sans-serif'
        this.activities.context.fillText('ABOUT', 12, 4)
        this.activities.context.font = '700 40px Arial, sans-serif'
        this.activities.context.fillText('WENHAN SHI', 14, 112)
        this.activities.context.font = '28px Arial, sans-serif'
        this.activities.context.fillText('Hi there 👋, Welcome to the dack side.', 14, 174)

        this.activities.context.font = '900 54px "Arial Narrow", Arial, sans-serif'
        this.activities.context.fillText('WRITING ABOUT', 430, 5)
        this.activities.context.font = '700 40px Arial, sans-serif'
        this.activities.context.fillText('KONG & API GATEWAYS', 430, 100)
        this.activities.context.fillText('CLOUD & DEVOPS', 430, 205)
        this.activities.context.fillText('PYTHON & AUTOMATION', 430, 310)
        this.activities.context.fillText('LINUX & TOOLING', 430, 415)

        this.activities.texture = new THREE.CanvasTexture(this.activities.canvas)
        this.activities.texture.magFilter = THREE.NearestFilter
        this.activities.texture.minFilter = THREE.LinearFilter

        // Material
        this.activities.material = new THREE.MeshBasicMaterial({ wireframe: false, color: 0xffffff, alphaMap: this.activities.texture, transparent: true })

        // Mesh
        this.activities.mesh = new THREE.Mesh(this.activities.geometry, this.activities.material)
        this.activities.mesh.position.x = this.activities.x
        this.activities.mesh.position.y = this.activities.y
        this.activities.mesh.matrixAutoUpdate = false
        this.activities.mesh.updateMatrix()
        this.container.add(this.activities.mesh)
    }

    setTiles()
    {
        this.tiles.add({
            start: new THREE.Vector2(this.x - 1.2, this.y + 13),
            delta: new THREE.Vector2(0, - 20)
        })
    }
}
